import "server-only";

import { ItemsList } from "../../client";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { listItems } from "../lib/item.service";

export async function ItemsListPage() {
  const organization = await getSelectedOrganization();
  return <ItemsList items={organization ? await listItems(organization.id) : []} />;
}
