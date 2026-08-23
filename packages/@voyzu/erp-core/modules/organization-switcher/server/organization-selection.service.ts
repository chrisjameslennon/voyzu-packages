import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import type { UserResponseDto } from "@voyzu/auth/types";
import { listOrganizations } from "@voyzu/erp-core/organizations/server";
import { getCurrentUser } from "@voyzu/auth/users/server";
import { listOrganizationIdsForUser } from "@voyzu/erp-core/organization-access/server";

function hasUiAccess(user: UserResponseDto | null): user is UserResponseDto {
  return user?.status === "ACTIVE" && (user.accessMode === "UI" || user.accessMode === "UI_AND_API");
}

export function filterSelectableOrganizations(
  organizations: OrganizationResponseDto[],
  user: UserResponseDto | null,
  assignedOrganizationIds: readonly number[] = [],
): OrganizationResponseDto[] {
  return filterAccessibleOrganizations(organizations, user, assignedOrganizationIds).filter((organization) => organization.status === "ACTIVE");
}

export function filterAccessibleOrganizations(
  organizations: OrganizationResponseDto[],
  user: UserResponseDto | null,
  assignedOrganizationIds: readonly number[] = [],
): OrganizationResponseDto[] {
  if (!hasUiAccess(user)) return [];

  const accessibleOrganizations = organizations.filter(
    (organization) => organization.status === "ACTIVE" || organization.status === "INACTIVE",
  );
  if (user.role === "ADMIN") return accessibleOrganizations;

  const assignedIds = new Set(assignedOrganizationIds);
  return accessibleOrganizations.filter((organization) => assignedIds.has(organization.id));
}

export function resolveOrganizationSelection(
  organizations: OrganizationResponseDto[],
  user: UserResponseDto | null,
  requestedOrganizationId: number | null,
  assignedOrganizationIds: readonly number[] = [],
) {
  const accessibleOrganizations = filterAccessibleOrganizations(organizations, user, assignedOrganizationIds);
  const selectableOrganizations = accessibleOrganizations.filter((organization) => organization.status === "ACTIVE");
  const selectedOrganization = accessibleOrganizations.find((organization) => organization.id === requestedOrganizationId)
    ?? selectableOrganizations[0]
    ?? null;

  return { organizations: selectableOrganizations, selectedOrganization };
}

async function listSelectableOrganizationsForCurrentUserUnchecked(): Promise<OrganizationResponseDto[]> {
  const [organizations, user] = await Promise.all([listOrganizations(), getCurrentUser()]);
  const organizationIds = user?.role === "STANDARD" ? await listOrganizationIdsForUser(user.id) : [];
  return filterSelectableOrganizations(organizations, user, organizationIds);
}

async function listAccessibleOrganizationsForCurrentUserUnchecked(): Promise<OrganizationResponseDto[]> {
  const [organizations, user] = await Promise.all([listOrganizations(), getCurrentUser()]);
  const organizationIds = user?.role === "STANDARD" ? await listOrganizationIdsForUser(user.id) : [];
  return filterAccessibleOrganizations(organizations, user, organizationIds);
}

async function resolveOrganizationSelectionForCurrentUserUnchecked(requestedOrganizationId: number | null) {
  const [organizations, user] = await Promise.all([listOrganizations(), getCurrentUser()]);
  const organizationIds = user?.role === "STANDARD" ? await listOrganizationIdsForUser(user.id) : [];
  return resolveOrganizationSelection(organizations, user, requestedOrganizationId, organizationIds);
}

export const listSelectableOrganizationsForCurrentUser = listSelectableOrganizationsForCurrentUserUnchecked;
export const listAccessibleOrganizationsForCurrentUser = listAccessibleOrganizationsForCurrentUserUnchecked;
export const resolveOrganizationSelectionForCurrentUser = resolveOrganizationSelectionForCurrentUserUnchecked;
