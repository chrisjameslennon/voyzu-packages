import "server-only";

import { IceCreamsList } from "../../client";
import { listIceCreamFlavors, listIceCreams } from "../lib/ice-cream.service";

export async function IceCreamsListPage() {
  const [iceCreams, flavors] = await Promise.all([
    listIceCreams(),
    listIceCreamFlavors(),
  ]);
  return <IceCreamsList iceCreams={iceCreams} flavors={flavors} />;
}
