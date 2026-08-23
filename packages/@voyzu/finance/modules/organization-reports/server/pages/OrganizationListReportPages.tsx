import "server-only";
import type { ReactNode } from "react";
import { getDb } from "@voyzu/capability/db";

import { listBankCashAccounts } from "@voyzu/finance/common/bank-cash-accounts/server";
import { listOrganizations } from "@voyzu/erp-core/organizations/server";
import { listControlAccounts } from "@voyzu/finance/common/control-accounts/server";
import { listCountries } from "@voyzu/localization/countries/server";
import { listCurrencies } from "@voyzu/localization/currencies/server";
import { listDimensions } from "@voyzu/finance/common/dimensions/server";
import { listFinancialDocumentTypes } from "@voyzu/finance/common/financial-document-types/server";
import { listGlAccountCategories } from "@voyzu/finance/common/gl-account-categories/server";
import { listGlAccounts } from "@voyzu/finance/common/gl-accounts/server";
import { listInventoryCategories } from "@voyzu/finance/common/inventory-categories/server";
import { listInventoryControlAccountSettings } from "@voyzu/finance/common/inventory-control-accounts/server";
import { listInventoryItems } from "@voyzu/finance/common/inventory-items/server";
import { listItemPostingProfiles } from "@voyzu/finance/common/inventory-item-posting-profiles/server";
import { listFinancialDocumentDefaults } from "@voyzu/finance/common/financial-document-defaults/server";
import { listTaxControlAccounts } from "@voyzu/finance/common/tax-control-accounts/server";
import { ledgerName } from "@voyzu/finance/common/server";
import type { Ledger } from "@voyzu/finance/types/modules/core";

import { OrganizationListReport, type OrganizationListReportColumn } from "./OrganizationListReport";
import { OrganizationListReportShell } from "../../client/OrganizationListReportShell";
import { organizationListReportCss } from "./organization-list-report.css";

type AnyRecord = Record<string, unknown>;
type ReportPageProps = {
  surface?: {
    searchParams?: Record<string, string>;
    unframed?: boolean;
  };
};

async function listCountriesWithTaxConfiguration() {
  const countries = await listCountries();
  const db = getDb();
  const [authorities, rules, components] = await Promise.all([
    db.query(`SELECT country_code, id, code, name, region_code, jurisdiction_level, status FROM tax_authority WHERE status != 'DELETED' ORDER BY country_code, code`),
    db.query(`SELECT country_code, id, code, name, region_code, invoice_label, calculation_method, component_count, status FROM tax_rule WHERE status != 'DELETED' ORDER BY country_code, code`),
    db.query(`SELECT tr.country_code, tc.id, tc.code, tc.tax_rule_code, tc.tax_authority_code, tc.scheme_code, tc.invoice_label, tc.rate, tc.status FROM tax_component tc JOIN tax_rule tr ON tr.country_code = tc.tax_rule_country_code AND tr.code = tc.tax_rule_code WHERE tc.status != 'DELETED' ORDER BY tr.country_code, tc.tax_rule_code, tc.calculation_order, tc.code`),
  ]);
  return countries.map((country) => ({
    ...country,
    taxAuthorities: authorities.rows.filter((row) => row.country_code === country.code).map((row) => ({
      id: String(row.id), code: String(row.code), name: String(row.name), regionCode: row.region_code == null ? null : String(row.region_code), jurisdictionLevel: String(row.jurisdiction_level), status: String(row.status),
    })),
    taxRules: rules.rows.filter((row) => row.country_code === country.code).map((row) => ({
      id: String(row.id), code: String(row.code), name: String(row.name), regionCode: row.region_code == null ? null : String(row.region_code), invoiceLabel: String(row.invoice_label), calculationMethod: String(row.calculation_method), componentCount: Number(row.component_count), status: String(row.status),
    })),
    taxComponents: components.rows.filter((row) => row.country_code === country.code).map((row) => ({
      id: String(row.id), code: String(row.code), taxRuleCode: String(row.tax_rule_code), taxAuthorityCode: String(row.tax_authority_code), schemeCode: String(row.scheme_code), invoiceLabel: String(row.invoice_label), rate: Number(row.rate), status: String(row.status),
    })),
  }));
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
}

function nested(row: AnyRecord, key: string): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as AnyRecord)[part];
  }, row);
}

function column<T extends AnyRecord>(key: string, label: string): OrganizationListReportColumn<T> {
  return { key, label, value: (row) => text(nested(row, key)) };
}

function widthColumn<T extends AnyRecord>(key: string, label: string, width: string): OrganizationListReportColumn<T> {
  return { key, label, width, value: (row) => text(nested(row, key)) };
}

function nowrapWidthColumn<T extends AnyRecord>(key: string, label: string, width: string): OrganizationListReportColumn<T> {
  return { key, label, width, nowrap: true, value: (row) => text(nested(row, key)) };
}

function rowsOf<T>(rows: T[]): AnyRecord[] {
  return rows as unknown as AnyRecord[];
}

function companyReportSettings(row: AnyRecord): ReactNode {
  return (
    <div className="orgListCompanyReportSettings">
      <div className="orgListCompanyReportHeadings">
        <div><span>Report heading 1:</span> {text(row.reportLine1) || "-"}</div>
        <div><span>Report heading 2:</span> {text(row.reportLine2) || "-"}</div>
      </div>
      <div><span>Report footer:</span> {text(row.reportFooter) || "-"}</div>
    </div>
  );
}

function sectionParamName(key: string): string {
  return `show${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

function inactiveRowsOption(label: string) {
  return {
    label,
    rowClassName: (row: AnyRecord) => row.status === "INACTIVE" ? "orgListInactiveRow" : undefined,
  };
}

async function report<T extends AnyRecord>(
  title: string,
  printablePath: string,
  rows: T[],
  columns: OrganizationListReportColumn<T>[],
  props?: ReportPageProps,
  rowSection?: (row: T) => { section?: string; subsection?: string; sectionKey?: string },
  orientation: "portrait" | "landscape" = "portrait",
  sectionVisibilityOptions?: Array<{ key: string; label: string }>,
  detailRow?: { content: (row: T) => ReactNode; className?: string },
  inactiveRowsOption?: { label: string; rowClassName: (row: T) => string | undefined },
) {
  const searchParams = props?.surface?.searchParams ?? {};
  const resolvedSectionVisibilityOptions = sectionVisibilityOptions?.map((option) => ({
    ...option,
    initialChecked: searchParams[sectionParamName(option.key)] === undefined
      ? true
      : searchParams[sectionParamName(option.key)] === "true",
  }));

  return (
    <OrganizationListReportShell
      title={title}
      printablePath={printablePath}
      orientation={orientation}
      sectionVisibilityOptions={resolvedSectionVisibilityOptions}
      inactiveRowsOption={inactiveRowsOption ? {
        label: inactiveRowsOption.label,
        initialChecked: searchParams.showInactive === "true",
      } : undefined}
      printable={props?.surface?.unframed === true}
    >
      <OrganizationListReport
        title={title}
        rows={rows}
        columns={columns}
        rowKey={(row, index) => `${text(row.code) || text(row.id) || "row"}:${index}`}
        rowSection={rowSection}
        rowClassName={inactiveRowsOption?.rowClassName}
        detailRow={detailRow}
      />
    </OrganizationListReportShell>
  );
}

export async function CompaniesReportPage(props?: ReportPageProps) {
  const rows = await listOrganizations();
  return report("Companies", "/finance/reports/lists/companies/printable", rowsOf(rows), [
    widthColumn("code", "Code", "14%"),
    nowrapWidthColumn("name", "Name", "36%"),
    nowrapWidthColumn("country.name", "Country", "22%"),
    widthColumn("baseCurrencyCode", "Currency", "13%"),
    widthColumn("status", "Status", "15%"),
  ], props, undefined, "portrait", undefined, {
    className: "orgListCompanyReportSettingsRow",
    content: companyReportSettings,
  }, {
    ...inactiveRowsOption("Show inactive Companies"),
  });
}

export async function CountriesReportPage(props?: ReportPageProps) {
  const rows = await listCountries();
  return report("Countries", "/finance/reports/lists/countries/printable", rowsOf(rows), [
    column("code", "Code"),
    column("name", "Name"),
    column("currencyCode", "Currency"),
    column("status", "Status"),
  ], props, undefined, "portrait", undefined, undefined, inactiveRowsOption("Show inactive Countries"));
}

function taxRate(rate: number): string {
  return `${Number((rate * 100).toFixed(6))}%`;
}

function countryTaxSettingsDocument(countries: Awaited<ReturnType<typeof listCountriesWithTaxConfiguration>>) {
  return (
    <div className="orgListDocument orgListCountryTaxDocument">
      <style>{organizationListReportCss}</style>
      <header className="orgListDocumentHeader">
        <h2 className="orgListReportTitle">Country Tax Settings</h2>
      </header>

      {countries.map((country) => {
        const authorities = country.taxAuthorities ?? [];
        const rules = country.taxRules ?? [];
        const lines = country.taxComponents ?? [];
        return (
          <section
            className={`orgListCountryTaxSection${country.status === "INACTIVE" ? " orgListInactiveRow" : ""}`}
            key={country.code}
          >
            <header className="orgListCountryTaxHeading">
              <h3>{country.name}</h3>
              <span>{country.code} · {country.status}</span>
            </header>

            {authorities.length > 0 ? (
              <div className="orgListCountryTaxGroup">
                <h4>Tax Authorities</h4>
                <table className="orgListReportTable">
                  <thead><tr><th>Code</th><th>Name</th><th>Region</th><th>Jurisdiction</th><th>Status</th></tr></thead>
                  <tbody>{authorities.map((authority) => (
                    <tr key={authority.id}>
                      <td>{authority.code}</td><td>{authority.name}</td><td>{authority.regionCode ?? "-"}</td>
                      <td>{authority.jurisdictionLevel}</td><td>{authority.status}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : null}

            {rules.length > 0 ? (
              <div className="orgListCountryTaxGroup">
                <h4>Tax Rules</h4>
                <table className="orgListReportTable">
                  <thead><tr><th>Code</th><th>Region</th><th>Name</th><th>Invoice Label</th><th>Calculation</th><th>Lines</th><th>Status</th></tr></thead>
                  <tbody>{rules.map((rule) => (
                    <tr key={rule.id}>
                      <td>{rule.code}</td><td>{rule.regionCode ?? "-"}</td><td>{rule.name}</td><td>{rule.invoiceLabel}</td>
                      <td>{rule.calculationMethod === "CONFIGURED_COMPONENTS" ? "SEE TAX RULE LINES" : rule.calculationMethod}</td>
                      <td>{rule.componentCount}</td><td>{rule.status}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : null}

            {lines.length > 0 ? (
              <div className="orgListCountryTaxGroup">
                <h4>Tax Rule Lines</h4>
                <table className="orgListReportTable">
                  <thead><tr><th>Code</th><th>Tax Rule</th><th>Authority</th><th>Scheme</th><th>Invoice Label</th><th>Rate</th><th>Status</th></tr></thead>
                  <tbody>{lines.map((line) => (
                    <tr key={line.id}>
                      <td>{line.code}</td><td>{line.taxRuleCode}</td><td>{line.taxAuthorityCode}</td><td>{line.schemeCode}</td>
                      <td>{line.invoiceLabel}</td><td>{taxRate(line.rate)}</td><td>{line.status}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : null}

            {authorities.length === 0 && rules.length === 0 && lines.length === 0 ? (
              <p className="orgListCountryTaxEmpty">No tax settings configured.</p>
            ) : null}
          </section>
        );
      })}

      <footer className="orgListDocumentFooter">Generated {new Date().toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })}</footer>
    </div>
  );
}

export async function CountryTaxSettingsReportPage(props?: ReportPageProps) {
  const countries = await listCountriesWithTaxConfiguration();
  const searchParams = props?.surface?.searchParams ?? {};

  return (
    <OrganizationListReportShell
      title="Country Tax Settings"
      printablePath="/finance/reports/lists/country-tax-settings/printable"
      orientation="landscape"
      inactiveRowsOption={{
        label: "Show inactive Countries",
        initialChecked: searchParams.showInactive === "true",
      }}
      printable={props?.surface?.unframed === true}
    >
      {countryTaxSettingsDocument(countries)}
    </OrganizationListReportShell>
  );
}

export async function CurrenciesReportPage(props?: ReportPageProps) {
  const rows = await listCurrencies();
  return report("Currencies", "/finance/reports/lists/currencies/printable", rowsOf(rows), [
    column("code", "Code"),
    column("name", "Name"),
    column("symbol", "Symbol"),
    column("status", "Status"),
  ], props, undefined, "portrait", undefined, undefined, inactiveRowsOption("Show inactive Currencies"));
}

export async function DimensionsReportPage(props?: ReportPageProps) {
  const rows = await listDimensions();
  const reportRows = rows.map((row) => ({
    ...row,
    valuesText: row.values?.map((value) => value.name).join(", ") ?? "",
  }));
  return report("Dimensions", "/finance/reports/lists/dimensions/printable", rowsOf(reportRows), [
    column("code", "Code"),
    column("name", "Name"),
    column("status", "Status"),
  ], props, undefined, "portrait", undefined, {
    className: "orgListDimensionValuesRow",
    content: (row) => (
      <div className="orgListDimensionValues">
        <span>Values:</span> {text(row.valuesText) || "-"}
      </div>
    ),
  }, inactiveRowsOption("Show inactive Dimensions"));
}

export async function FinancialDocumentTypesReportPage(props?: ReportPageProps) {
  const rows = await listFinancialDocumentTypes();
  return report("Financial Document Types", "/finance/reports/lists/financial-document-types/printable", rowsOf(rows), [
    column("code", "Code"),
    {
      key: "primarySupportingLedger",
      label: "Supporting Ledger",
      value: (row) => ledgerName(row.primarySupportingLedger as Ledger),
    },
    column("status", "Status"),
  ], props, undefined, "portrait", undefined, undefined, inactiveRowsOption("Show inactive Financial Document Types"));
}

export async function GlAccountsReportPage(props?: ReportPageProps) {
  const rows = await listGlAccounts();
  return report("General Ledger Accounts", "/finance/reports/lists/general-ledger-accounts/printable", rowsOf(rows), [
    widthColumn("code", "Code", "10%"),
    nowrapWidthColumn("name", "Name", "30%"),
    widthColumn("accountType", "Type", "10%"),
    widthColumn("category.code", "Category Code", "18%"),
    nowrapWidthColumn("category.name", "Category Name", "22%"),
    widthColumn("status", "Status", "10%"),
  ], props, undefined, "landscape", undefined, undefined, inactiveRowsOption("Show inactive General Ledger Accounts"));
}

export async function InventoryCategoriesReportPage(props?: ReportPageProps) {
  const [categories, postingProfiles] = await Promise.all([
    listInventoryCategories(),
    listItemPostingProfiles(),
  ]);
  const postingProfileNames = new Map(
    postingProfiles.map((profile) => [profile.profile_code, profile.profile_name]),
  );
  const rows = categories.map((category) => ({
    ...category,
    postingProfileName: postingProfileNames.get(category.posting_profile_code) ?? "",
  }));
  return report("Inventory Categories", "/finance/reports/lists/inventory-categories/printable", rowsOf(rows), [
    column("code", "Code"),
    column("name", "Name"),
    column("description", "Description"),
    column("posting_profile_code", "Posting Profile Code"),
    column("postingProfileName", "Posting Profile Name"),
    column("status", "Status"),
  ], props, undefined, "landscape", undefined, undefined, inactiveRowsOption("Show inactive Inventory Categories"));
}

export async function InventoryItemsReportPage(props?: ReportPageProps) {
  const [items, categories] = await Promise.all([
    listInventoryItems(),
    listInventoryCategories(),
  ]);
  const categoryNames = new Map(categories.map((category) => [category.code, category.name]));
  const rows = items.map((item) => ({
    ...item,
    categoryName: categoryNames.get(item.category_code) ?? "",
  }));

  return report("Inventory Items", "/finance/reports/lists/inventory-items/printable", rowsOf(rows), [
    nowrapWidthColumn("item_code", "Item Code", "18%"),
    nowrapWidthColumn("item_name", "Item Name", "32%"),
    widthColumn("item_type", "Item Type", "15%"),
    widthColumn("category_code", "Category Code", "15%"),
    nowrapWidthColumn("categoryName", "Category Name", "12%"),
    widthColumn("status", "Status", "8%"),
  ], props, undefined, "landscape", undefined, {
    className: "orgListInventoryItemDetailsRow",
    content: (row) => (
      <div className="orgListInventoryItemDetails">
        <div><span>Unit:</span> {text(row.unit_code) || "-"}</div>
      </div>
    ),
  }, inactiveRowsOption("Show inactive Inventory Items"));
}

export async function FinancialDocumentDefaultsReportPage(props?: ReportPageProps) {
  const rows = await listFinancialDocumentDefaults();
  const reportRows = rows.map((row) => ({
    documentCode: row.documentCode,
    code: row.code,
    name: row.name,
    target: row.targetType,
    glCode: row.glAccount?.code ?? row.bankCashControlAccount?.glAccountCode,
    glName: row.glAccount?.name ?? row.bankCashControlAccount?.glAccountName,
    status: row.status,
    order: `${row.documentCode}:${row.code}`,
  })).sort((a, b) => a.order.localeCompare(b.order));

  return report("Financial Document Defaults", "/finance/reports/lists/financial-document-defaults/printable", reportRows as AnyRecord[], [
    widthColumn("documentCode", "Document", "15%"),
    widthColumn("code", "Code", "20%"),
    nowrapWidthColumn("name", "Name", "28%"),
    nowrapWidthColumn("target", "Target", "16%"),
    widthColumn("glCode", "GL Code", "9%"),
    nowrapWidthColumn("glName", "GL Account", "12%"),
  ], props, undefined, "landscape", undefined, undefined, inactiveRowsOption("Show inactive Financial Document Defaults"));
}

export async function ReportingCategoriesReportPage(props?: ReportPageProps) {
  const rows = await listGlAccountCategories();
  return report("General Ledger Reporting Categories", "/finance/reports/lists/general-ledger-reporting-categories/printable", rowsOf(rows), [
    column("code", "Code"),
    column("name", "Name"),
    column("accountType", "Account Type"),
    column("status", "Status"),
  ], props, undefined, "portrait", undefined, undefined, inactiveRowsOption("Show inactive Reporting Categories"));
}

const itemPostingCodes = [
  { key: "revenue_code", label: "Revenue Code" },
  { key: "cogs_code", label: "COGS Code" },
  { key: "purchase_expense_code", label: "Purchase Expense Code" },
  { key: "consumption_code", label: "Consumption Code" },
  { key: "adjustment_gain_code", label: "Adjustment Gain Code" },
  { key: "adjustment_loss_code", label: "Adjustment Loss Code" },
] as const;

type ItemPostingProfileForReport = Awaited<ReturnType<typeof listItemPostingProfiles>>[number];

function itemPostingSlots(profile: ItemPostingProfileForReport) {
  return (
    <div className="orgListSlotLines">
      {itemPostingCodes.map((postingCode) => {
        const account = profile[postingCode.key];
        return (
          <div className="orgListSlotLine" key={postingCode.key}>
            <span className="orgListSlotName">{postingCode.label}</span>
            <span className={account ? "orgListSlotCode" : "orgListSlotMissing"}>{account?.code ?? "-"}</span>
            <span className={account ? undefined : "orgListSlotMissing"}>{account?.name ?? "-"}</span>
          </div>
        );
      })}
    </div>
  );
}

export async function LedgerBackedAccountCodesReportPage(props?: ReportPageProps) {
  const [controlAccounts, taxMovements, bankCashAccounts, inventoryControlAccounts] = await Promise.all([
    listControlAccounts(),
    listTaxControlAccounts(),
    listBankCashAccounts(),
    listInventoryControlAccountSettings(),
  ]);
  const rows = [
    ...controlAccounts.map((row) => ({
      code: row.code,
      name: row.name,
      supportingLedger: ledgerName(row.ledger as Ledger),
      glCode: row.glAccount?.code,
      glName: row.glAccount?.name,
      status: row.status,
      sectionKey: "ledgerControlAccounts",
      subsection: ledgerName(row.ledger as Ledger),
      order: `1:${row.ledger}:${row.code}`,
    })),
    ...taxMovements.map((row) => ({
      code: row.code,
      name: row.name,
      supportingLedger: ledgerName(row.ledger as Ledger),
      glCode: row.glAccount.code,
      glName: row.glAccount.name,
      status: row.status,
      sectionKey: "ledgerControlAccounts",
      subsection: ledgerName(row.ledger as Ledger),
      order: `1:${row.ledger}:${row.code}`,
    })),
    ...bankCashAccounts.map((row) => ({
      code: row.code,
      name: "-",
      supportingLedger: ledgerName(row.ledger as Ledger),
      glCode: row.glAccount?.code,
      glName: row.glAccount?.name,
      status: row.status,
      sectionKey: "ledgerControlAccounts",
      subsection: ledgerName(row.ledger as Ledger),
      order: `1:${row.ledger}:${row.code}`,
    })),
    ...inventoryControlAccounts.map((row) => ({
      code: row.code,
      name: row.name,
      supportingLedger: ledgerName(row.ledger as Ledger),
      glCode: row.glAccount.code,
      glName: row.glAccount.name,
      status: row.status,
      sectionKey: "ledgerControlAccounts",
      subsection: ledgerName(row.ledger as Ledger),
      order: `1:${row.ledger}:${row.code}`,
    })),
  ].sort((a, b) => a.order.localeCompare(b.order));

  return report("Ledger Backed Account Codes", "/finance/reports/lists/ledger-backed-account-codes/printable", rows as AnyRecord[], [
    widthColumn("code", "Code", "12%"),
    nowrapWidthColumn("name", "Name", "22%"),
    nowrapWidthColumn("supportingLedger", "Supporting Ledger", "18%"),
    widthColumn("glCode", "GL Code", "9%"),
    nowrapWidthColumn("glName", "GL Account", "39%"),
  ], props, (row) => ({ section: text(row.section), subsection: text(row.subsection), sectionKey: text(row.sectionKey) }), "landscape", undefined, undefined, inactiveRowsOption("Show inactive Ledger Backed Account Codes"));
}

export async function InventoryItemPostingCodesReportPage(props?: ReportPageProps) {
  const itemPostingProfiles = await listItemPostingProfiles();
  const rows = itemPostingProfiles
    .map((profile) => ({
      code: profile.profile_code,
      name: profile.profile_name,
      description: profile.description,
      slots: itemPostingSlots(profile),
      status: profile.status,
      order: profile.profile_code,
    }))
    .sort((a, b) => a.order.localeCompare(b.order));

  return report("Inventory Item Posting Codes", "/finance/reports/lists/inventory-item-posting-codes/printable", rows as AnyRecord[], [
    widthColumn("code", "Code", "15%"),
    nowrapWidthColumn("name", "Name", "25%"),
    widthColumn("description", "Description", "60%"),
  ], props, undefined, "landscape", undefined, {
    className: "orgListDetailRow",
    content: (row) => row.slots as ReactNode,
  }, inactiveRowsOption("Show inactive Inventory Item Posting Codes"));
}
