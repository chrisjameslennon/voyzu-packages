import "server-only";

import { AllIceCreamsReport } from "../../client/AllIceCreamsReport";
import { getAllIceCreamsReport } from "../lib/ice-cream-report.service";

export async function AllIceCreamsReportPage({
  surface,
}: {
  surface?: { unframed?: boolean };
} = {}) {
  return (
    <AllIceCreamsReport
      rows={await getAllIceCreamsReport()}
      printable={surface?.unframed === true}
    />
  );
}
