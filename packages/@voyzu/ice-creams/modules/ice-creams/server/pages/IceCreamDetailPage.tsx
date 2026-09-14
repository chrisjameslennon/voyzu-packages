import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";
import { IceCreamDetail } from "../../client";
import { getIceCream, listIceCreamFlavors } from "../lib/ice-cream.service";

export async function IceCreamDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const [iceCream, flavors] = await Promise.all([
    getIceCream((code)),
    listIceCreamFlavors(),
  ]);
  if (!iceCream) notFound();
  return <IceCreamDetail iceCream={iceCream} flavors={flavors} />;
}
