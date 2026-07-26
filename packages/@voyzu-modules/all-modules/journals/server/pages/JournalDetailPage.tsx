import "server-only";

import { JournalDetail } from "../../client";
import { normalizeDetailBackSource } from "@voyzu-modules/all-modules/common/server";
import { getSelectedCompany } from "../lib/company-context";
import { getJournal } from "../lib/journal.service";

interface JournalDetailPageProps {
  code?: string;
  surface?: {
    searchParams?: Record<string, string>;
  };
}

export async function JournalDetailPage({ code, surface }: JournalDetailPageProps) {
  const company = await getSelectedCompany();
  const resolvedCode = decodeURIComponent(code ?? "");
  const journal = company && resolvedCode ? await getJournal(company.id, resolvedCode) : null;
  const searchParams = surface?.searchParams ?? {};

  return (
    <JournalDetail
      code={resolvedCode}
      company={company ? { id: company.id, code: company.code, name: company.name } : null}
      journal={journal}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
