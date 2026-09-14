import { type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { AllIceCreamsReport } from "../../client";
import { getAllIceCreamsReport } from "../lib/ice-cream-report.service";

export async function AllIceCreamsReportPage({ context }: PageProps) {
  return (
    <AllIceCreamsReport
      rows={await getAllIceCreamsReport()}
      printable={context.routeDefinition.unframed === true}
    />
  );
}
