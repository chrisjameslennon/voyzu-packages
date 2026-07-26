"use client";

import type { InventoryCategoryPatchRequestDto, InventoryCategoryResponseDto } from "@voyzu-modules/core/types/modules/inventory-categories";
import { Button, Input, SearchableSelect } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface InventoryCategoryDetailsFormProps {
  code: NonNullable<InventoryCategoryPatchRequestDto["code"]>;
  name: NonNullable<InventoryCategoryPatchRequestDto["name"]>;
  description: InventoryCategoryResponseDto["description"];
  postingProfileCode: InventoryCategoryResponseDto["posting_profile_code"];
  postingProfileOptions: Array<{ value: string; label: string; code?: string }>;
  saving?: boolean;
  nameHasError?: boolean;
  descriptionHasError?: boolean;
  postingProfileHasError?: boolean;
  codeHasError?: boolean;
  onCodeChange: (value: NonNullable<InventoryCategoryPatchRequestDto["code"]>) => void;
  onNameChange: (value: NonNullable<InventoryCategoryPatchRequestDto["name"]>) => void;
  onDescriptionChange: (value: NonNullable<InventoryCategoryPatchRequestDto["description"]>) => void;
  onPostingProfileChange: (value: NonNullable<InventoryCategoryPatchRequestDto["posting_profile_code"]>) => void;
  onSave: () => void;
}

export function InventoryCategoryDetailsForm({
  code,
  name,
  description,
  postingProfileCode,
  postingProfileOptions,
  saving = false,
  nameHasError = false,
  descriptionHasError = false,
  postingProfileHasError = false,
  codeHasError = false,
  onCodeChange,
  onNameChange,
  onDescriptionChange,
  onPostingProfileChange,
  onSave,
}: InventoryCategoryDetailsFormProps) {
  return (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Category Details</h2>
        <div className={detailStyles.cardHeaderActions}>
          <Button variant="secondary" icon="save" disabled={saving} onClick={onSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Code</span><Input invalid={codeHasError} value={code} onChange={(event) => onCodeChange(event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Name</span><Input invalid={nameHasError} value={name} onChange={(event) => onNameChange(event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Description</span><Input invalid={descriptionHasError} value={description} onChange={(event) => onDescriptionChange(event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Posting Profile</span><SearchableSelect value={postingProfileCode} onChange={onPostingProfileChange} options={postingProfileOptions} hasError={postingProfileHasError} placeholder="Select a posting profile" searchPlaceholder="Search posting profiles..." /></label>
      </div>
    </section>
  );
}
