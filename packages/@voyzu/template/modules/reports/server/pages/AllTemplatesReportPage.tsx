import { type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { AllTemplatesReport } from "../../client/AllTemplatesReport";
import { getAllTemplatesReport } from "../lib/template-report.service";

export async function AllTemplatesReportPage({ context }: PageProps) {
  const generatedAt = new Date().toISOString();
  return (
    <AllTemplatesReport
      rows={await getAllTemplatesReport()}
      generatedAt={generatedAt}
      printable={context.routeDefinition.unframed === true}
    />
  );
}
