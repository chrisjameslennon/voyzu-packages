import type { IceCreamCreateRequestDto } from "@voyzu/ice-creams/types";
import {
  batchCreateIceCreams,
  batchGetIceCreams,
} from "../../modules/ice-creams/server/lib/ice-cream.service";

export const iceCreamSampleData: IceCreamCreateRequestDto[] = [
  { code: "CLASSIC_VANILLA", name: "Classic Vanilla", flavorCode: "VANILLA", supplier: "Southern Alps Creamery" },
  { code: "DARK_CHOCOLATE", name: "Midnight Chocolate", flavorCode: "CHOCOLATE", supplier: "North Shore Dairy Foods" },
  { code: "BERRY_GARDEN", name: "Strawberry Garden", flavorCode: "STRAWBERRY", supplier: "Berry Fields Co-operative" },
  { code: "KIWI_HOKEY_POKEY", name: "Kiwi Hokey Pokey", flavorCode: "HOKEY_POKEY", supplier: "The Chilly Bin Creamery" },
  { code: "KYOTO_MATCHA", name: "Kyoto Matcha", flavorCode: "MATCHA", supplier: "Green Whisk Trading" },
  { code: "SESAME_NIGHT", name: "Black Sesame Night", flavorCode: "BLACK_SESAME", supplier: "Sub-Zero Scoops" },
  { code: "PURPLE_UBE", name: "Purple Ube Dream", flavorCode: "UBE", supplier: "Manila Frozen Foods" },
  { code: "LAVENDER_APIARY", name: "Lavender Apiary", flavorCode: "LAVENDER_HONEY", supplier: "Brrr & Bloom" },
  { code: "FIG_AND_GOAT", name: "Fig and Goat Cheese", flavorCode: "GOAT_CHEESE_FIG", supplier: "Hill Country Dairy" },
  { code: "WASABI_WAKEUP", name: "Wasabi Wake-Up", flavorCode: "WASABI", supplier: "The Cold Shoulder Company" },
  { code: "BLUE_PEAR", name: "Blue Cheese and Pear", flavorCode: "BLUE_CHEESE_PEAR", supplier: "Frost & Forage" },
  { code: "CHARCOAL_TIDE", name: "Charcoal Coconut Tide", flavorCode: "CHARCOAL_COCONUT", supplier: "Black Sand Gelato Works" },
  { code: "SAFFRON_ROSE", name: "Saffron Rose", flavorCode: "SAFFRON_ROSE", supplier: "Ice to Meet You Ltd" },
  { code: "SWEET_CORN_SUNDAE", name: "Sweet Corn Sundae", flavorCode: "SWEET_CORN", supplier: "Polar Pantry Provisions" },
];

/**
 * Installs repeatable demonstration data after package DDL and reference seeds.
 * Existing records are preserved; only missing business codes are created.
 */
export async function install(): Promise<void> {
  const existing = await batchGetIceCreams(iceCreamSampleData.map(({ code }) => code));
  const existingCodes = new Set(existing.map(({ code }) => code));
  const missing = iceCreamSampleData.filter(({ code }) => !existingCodes.has(code));
  if (missing.length) await batchCreateIceCreams(missing);
}

export default install;
