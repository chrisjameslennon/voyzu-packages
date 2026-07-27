import "server-only";

import { notFound } from "next/navigation";
import { IceCreamDetail } from "../../client";
import { getIceCream, listIceCreamFlavors } from "../lib/ice-cream.service";

export async function IceCreamDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const [iceCream, flavors] = await Promise.all([
    getIceCream(decodeURIComponent(code)),
    listIceCreamFlavors(),
  ]);
  if (!iceCream) notFound();
  return <IceCreamDetail iceCream={iceCream} flavors={flavors} />;
}
