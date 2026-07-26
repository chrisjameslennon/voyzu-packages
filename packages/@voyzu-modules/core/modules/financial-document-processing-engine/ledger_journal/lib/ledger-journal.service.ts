import type { DrCr } from "@voyzu/types/modules/core";
import type {
  BankCashJournalDetailsDto,
} from "@voyzu-modules/core/types/modules/financial-document-processing-engine/bank-cash-details.dto";
import type {
  LedgerJournalDetailedDocumentDto,
  LedgerJournalJournalLineDto,
  LedgerJournalPostingDetailsDto,
  LedgerJournalPostingResponseDto,
} from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ledger-journal.response.dto";
import type { LedgerJournalRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ledger-journal.request.dto";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";

import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { resolveBankCashDetails, toJournalBankCashFields } from "../../../common/bank-cash-accounts/server/lib/bank-cash-account.service";
import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { LedgerJournalPostingRepo } from "../db/ledger-journal-posting.repo";
import type { DimensionValueLookupRow, GlAccountPostingRow, ProtectedGlAccountLinkRow } from "../db/ledger-journal-posting.row.types";
import { validateData, validateRequest, type LedgerJournalDataValidationContext } from "./ledger-journal.validator";
import { LEDGER_JOURNAL_DOCUMENT_LABEL, LEDGER_JOURNAL_ENGINE_CODE, type LedgerJournalPostingLine } from "./ledger-journal.types";

export interface ProcessLedgerJournalOptions {
  preview?: boolean;
}

type ResolvedLedgerJournalRequestDto = LedgerJournalRequestDto & { document_type: "LEDGER_JOURNAL" };
type LedgerJournalRequestWithDocumentId = LedgerJournalRequestDto & { document_id: string };

interface ResolvedContext {
  request: ResolvedLedgerJournalRequestDto;
  data: LedgerJournalDataValidationContext;
  detailedDocument: LedgerJournalDetailedDocumentDto;
  bankCashDetails: BankCashJournalDetailsDto | null;
  generated: {
    journalLines: LedgerJournalPostingLine[];
    totalDebitBaseAmount: number;
    totalCreditBaseAmount: number;
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function requestedGlAccountCodes(input: LedgerJournalRequestDto): string[] {
  return [...new Set(input.lines.map((line) => line.gl_account_code))];
}

function requestedDimensionPairs(input: LedgerJournalRequestDto): Array<{ dimensionCode: string; valueName: string }> {
  const pairs = new Map<string, { dimensionCode: string; valueName: string }>();
  for (const line of input.lines) {
    for (const [dimensionCode, valueName] of Object.entries(line.dimensions ?? {})) {
      pairs.set(`${dimensionCode}\u0000${valueName}`, { dimensionCode, valueName });
    }
  }
  return [...pairs.values()];
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

function mapDimensionValues(rows: DimensionValueLookupRow[]): Map<string, DimensionValueLookupRow> {
  return new Map(rows.map((row) => [`${row.dimension_code}\u0000${row.dimension_value_name}`, row]));
}

function lineDescription(line: LedgerJournalRequestDto["lines"][number], glAccount: GlAccountPostingRow): string {
  return line.description?.trim() || glAccount.name;
}

function bankCashLinkForGlCode(data: LedgerJournalDataValidationContext, glAccountCode: string): ProtectedGlAccountLinkRow | null {
  return (data.protectedLinksByGlCode.get(glAccountCode) ?? []).find((link) => link.source === "BANK_CASH") ?? null;
}

async function resolveLedgerBankCashDetails(input: LedgerJournalRequestDto, data: LedgerJournalDataValidationContext): Promise<BankCashJournalDetailsDto | null> {
  if (!input.bank_cash_details) return null;
  if (!data.documentProcessor?.cash_movement) throw new BusinessRuleError("LEDGER_JOURNAL does not support bank_cash_details");
  const bankLinks = input.lines
    .map((line) => bankCashLinkForGlCode(data, line.gl_account_code))
    .filter((link): link is ProtectedGlAccountLinkRow => link != null);
  if (bankLinks.length === 0) throw new InputValidationError("bank_cash_details requires at least one line posted to a BANK_CASH linked GL account");
  const details = await resolveBankCashDetails(data.company!.id, data.company!.base_currency_code, input.bank_cash_details);
  if (!bankLinks.some((link) => link.source_code === details?.code)) {
    throw new BusinessRuleError(`bank_cash_details.code ${details?.code} does not match a BANK_CASH linked GL account in this journal`);
  }
  return details;
}

function buildContext(input: LedgerJournalRequestWithDocumentId, data: LedgerJournalDataValidationContext, bankCashDetails: BankCashJournalDetailsDto | null): ResolvedContext {
  const request: ResolvedLedgerJournalRequestDto = { ...input, document_type: "LEDGER_JOURNAL" };
  const company = data.company!;
  const detailedLines = input.lines
    .slice()
    .sort((a, b) => a.line_id - b.line_id)
    .map((line) => {
      const glAccount = data.glAccountsByCode.get(line.gl_account_code)!;
      return {
        line_id: line.line_id,
        gl_account_code: glAccount.code,
        gl_account_name: glAccount.name,
        description: lineDescription(line, glAccount),
        memo: line.memo ?? null,
        dr_cr: line.dr_cr,
        base_currency_amount: round2(Number(line.base_currency_amount)),
        dimensions: line.dimensions ?? {},
      };
    });

  const totalDebitBaseAmount = round2(detailedLines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0));
  const totalCreditBaseAmount = round2(detailedLines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0));
  const documentDescription = `${LEDGER_JOURNAL_DOCUMENT_LABEL} ${input.document_id}`;

  const detailedDocument: LedgerJournalDetailedDocumentDto = {
    company: {
      code: company.code,
      base_currency_code: company.base_currency_code,
    },
    document_id: input.document_id,
    document_memo: input.document_memo ?? null,
    bank_cash_details: bankCashDetails,
    generated_description: documentDescription,
    posting_date: input.posting_date,
    lines: detailedLines,
    total_debit_base_amount: totalDebitBaseAmount,
    total_credit_base_amount: totalCreditBaseAmount,
  };

  const generated = {
    journalLines: detailedLines.map((line, index): LedgerJournalPostingLine => {
      const glAccount = data.glAccountsByCode.get(line.gl_account_code)!;
      const bankCashLink = bankCashLinkForGlCode(data, glAccount.code);
      return {
        line_number: index + 1,
        gl_account_id: glAccount.id,
        gl_account_code: glAccount.code,
        gl_account_name: glAccount.name,
        source_ledger: bankCashLink ? "BANK_CASH" : null,
        source_control_account: bankCashLink?.source_code ?? null,
        description: line.description,
        memo: line.memo,
        dr_cr: line.dr_cr,
        base_currency_amount: line.base_currency_amount,
        dimensions: Object.entries(line.dimensions).map(([dimensionCode, valueName]) => {
          const dimension = data.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${valueName}`)!;
          return {
            dimension_id: dimension.dimension_id,
            dimension_value_id: dimension.dimension_value_id,
            dimension_code: dimension.dimension_code,
            dimension_name: dimension.dimension_name,
            dimension_value_name: dimension.dimension_value_name,
          };
        }),
      };
    }),
    totalDebitBaseAmount,
    totalCreditBaseAmount,
  };

  return { request, data, detailedDocument, bankCashDetails, generated };
}

async function resolveContext(input: LedgerJournalRequestWithDocumentId): Promise<ResolvedContext> {
  const repo = new LedgerJournalPostingRepo(getDb());
  const company = await repo.getCompanyByCode(input.company_code);
  if (company && company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const settingsCompanyId = company ? await resolveEffectiveSettingsCompanyId(company.id) : null;
  const [documentProcessor, fiscalPeriod, glAccounts, protectedLinks, dimensionValues] = await Promise.all([
    company ? repo.getDocumentProcessor() : Promise.resolve(null),
    company ? repo.getOpenFiscalPeriod(company.id, input.posting_date) : Promise.resolve(null),
    settingsCompanyId ? repo.listGlAccounts(settingsCompanyId, requestedGlAccountCodes(input)) : Promise.resolve([]),
    settingsCompanyId ? repo.listProtectedGlAccountLinks(settingsCompanyId, requestedGlAccountCodes(input)) : Promise.resolve([]),
    settingsCompanyId ? repo.listDimensionValues(settingsCompanyId, requestedDimensionPairs(input)) : Promise.resolve([]),
  ]);

  const protectedLinksByGlCode = new Map<string, typeof protectedLinks>();
  for (const link of protectedLinks) {
    const existing = protectedLinksByGlCode.get(link.gl_account_code) ?? [];
    existing.push(link);
    protectedLinksByGlCode.set(link.gl_account_code, existing);
  }

  const data: LedgerJournalDataValidationContext = {
    company,
    documentProcessor,
    fiscalPeriod,
    glAccountsByCode: mapByCode(glAccounts),
    protectedLinksByGlCode,
    dimensionValuesByDimensionCodeAndName: mapDimensionValues(dimensionValues),
  };
  validateData(input, data);
  const bankCashDetails = await resolveLedgerBankCashDetails(input, data);
  return buildContext(input, data, bankCashDetails);
}

function journalLineDto(line: LedgerJournalPostingLine, inserted?: JournalLineRow | null): LedgerJournalJournalLineDto {
  return {
    id: inserted?.id ?? null,
    journal_header_id: inserted?.journal_header_id ?? null,
    line_number: line.line_number,
    gl_account_code: line.gl_account_code,
    gl_account_name: line.gl_account_name,
    source_ledger: inserted?.source_ledger ?? line.source_ledger ?? null,
    source_control_account: inserted?.source_control_account ?? line.source_control_account ?? null,
    dr_cr: line.dr_cr as DrCr,
    base_currency_amount: line.base_currency_amount,
    description: line.description,
    document_memo: line.memo ?? null,
    dimensions: line.dimensions?.map((dimension) => ({
      dimension_code: dimension.dimension_code,
      dimension_name: dimension.dimension_name,
      dimension_value_name: dimension.dimension_value_name,
    })),
  };
}

function postingDetails(context: ResolvedContext, postedJournal?: JournalHeaderRow | null, insertedLines: JournalLineRow[] = []): LedgerJournalPostingDetailsDto {
  return {
    journal_header: {
      id: postedJournal?.id ?? null,
      code: postedJournal?.code ?? null,
      document_type_code: LEDGER_JOURNAL_ENGINE_CODE,
      document_id: context.detailedDocument.document_id,
      generated_description: context.detailedDocument.generated_description,
      posting_engine_code: LEDGER_JOURNAL_ENGINE_CODE,
      company_code: context.data.company!.code,
      document_date: context.detailedDocument.posting_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      total_debit_base_amount: context.generated.totalDebitBaseAmount,
      total_credit_base_amount: context.generated.totalCreditBaseAmount,
      document_memo: context.detailedDocument.document_memo,
      status: postedJournal ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: context.generated.journalLines.map((line, index) => journalLineDto(line, insertedLines[index])),
  };
}

export async function processLedgerJournal(
  input: LedgerJournalRequestDto,
  options: ProcessLedgerJournalOptions = {},
): Promise<LedgerJournalPostingResponseDto> {
  validateRequest(input);
  const rawRequest = input;
  let reservedJournalHeaderId: number | null = null;
  let request: LedgerJournalRequestWithDocumentId;
  if (rawRequest.document_id) {
    request = rawRequest as LedgerJournalRequestWithDocumentId;
  } else {
    reservedJournalHeaderId = await new JournalRepo(getDb()).reserveHeaderId();
    request = { ...rawRequest, document_id: `GLJ-${reservedJournalHeaderId}` };
  }
  const context = await resolveContext(request);

  if (options.preview) {
    return {
      detailed_document: context.detailedDocument,
      posting_details: postingDetails(context),
    };
  }

  return withTransaction(async (client) => {
    const journalRepo = new JournalRepo(client);

    const journalHeader = await journalRepo.insert({
      id: reservedJournalHeaderId ?? undefined,
      company_id: context.data.company!.id,
      company_code: context.data.company!.code,
      company_name: context.data.company!.name,
      document_type_code: LEDGER_JOURNAL_ENGINE_CODE,
      document_type_label: LEDGER_JOURNAL_DOCUMENT_LABEL,
      document_id: context.detailedDocument.document_id,
      description: context.detailedDocument.generated_description,
      document_snapshot_json: context.request,
      detailed_document_snapshot_json: context.detailedDocument,
      posting_engine_code: LEDGER_JOURNAL_ENGINE_CODE,
      document_date: context.detailedDocument.posting_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      memo: context.detailedDocument.document_memo,
      ...toJournalBankCashFields(context.bankCashDetails),
    });

    const journalLines: JournalLineRow[] = [];
    for (const line of context.generated.journalLines) {
      const insertedLine = await journalRepo.insertLine({
        journal_header_id: journalHeader.id,
        ...line,
      });
      journalLines.push(insertedLine);
      for (const dimension of line.dimensions ?? []) {
        await journalRepo.insertLineDimension({
          journal_line_id: insertedLine.id,
          ...dimension,
        });
      }
    }

    const postedJournal = await journalRepo.setPosted(
      journalHeader.id,
      context.generated.totalDebitBaseAmount,
      context.generated.totalCreditBaseAmount,
    );

    return {
      detailed_document: context.detailedDocument,
      posting_details: postingDetails(context, postedJournal, journalLines),
    };
  });
}

