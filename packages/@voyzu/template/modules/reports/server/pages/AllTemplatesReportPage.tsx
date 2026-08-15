import "server-only";

import { AllTemplatesReport } from "../../client/AllTemplatesReport";
import { getAllTemplatesReport } from "../lib/template-report.service";

export async function AllTemplatesReportPage({
  surface,
}: {
  surface?: { unframed?: boolean };
} = {}) {
  const generatedAt = new Date().toISOString();
  return (
    <AllTemplatesReport
      rows={await getAllTemplatesReport()}
      generatedAt={generatedAt}
      printable={surface?.unframed === true}
    />
  );
}
