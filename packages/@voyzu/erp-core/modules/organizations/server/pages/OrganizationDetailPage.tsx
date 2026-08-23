import "server-only";

import { notFound } from "next/navigation";
import { resolveExternalUrl } from "@voyzu/ui-surface";

import { getDb } from "@voyzu/capability/db";
import { listCurrencies } from "@voyzu/localization/currencies/server";

import { OrganizationDetail } from "../../client";
import { getOrganization } from "../lib/organization.service";

interface OrganizationDetailPageProps {
  code?: string;
  surface?: { helpBaseUrl?: string };
}

type SelectOption = { value: string; label: string; code?: string };

async function listActiveCountries(): Promise<SelectOption[]> {
  const { rows } = await getDb().query(
    `SELECT code, name FROM country WHERE status = 'ACTIVE' ORDER BY name ASC`,
  );
  return rows.map((row) => ({
    value: String(row.code),
    label: String(row.name),
    code: String(row.code),
  }));
}

export async function OrganizationDetailPage({ code, surface }: OrganizationDetailPageProps) {
  if (!code) notFound();

  const [organization, countries, currencies] = await Promise.all([
    getOrganization(decodeURIComponent(code)),
    listActiveCountries(),
    listCurrencies(),
  ]);

  if (!organization) notFound();

  return (
    <OrganizationDetail
      organization={organization}
      activeCountries={countries}
      activeCurrencies={currencies
        .filter((currency) => currency.status === "ACTIVE")
        .map((currency) => ({
          value: currency.code,
          label: currency.name,
          code: currency.code,
        }))}
      organizationOrganizationsHelpUrl={surface?.helpBaseUrl
        ? resolveExternalUrl(surface.helpBaseUrl, "concepts/organizations-and-organizations")
        : undefined}
    />
  );
}
