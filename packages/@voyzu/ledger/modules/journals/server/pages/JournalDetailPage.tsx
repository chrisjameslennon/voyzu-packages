import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { JournalDetail } from "../../client/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../lib/company-context";
import { getJournal } from "../lib/journal.service";

export async function JournalDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  const company = await getSelectedCompany();
  const resolvedCode = (code ?? "");
  const journal = company && resolvedCode ? await getJournal(company.id, resolvedCode) : null;
  const searchParams = pageStringParameters(context.queryParams);

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
