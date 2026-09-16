"use client";
import { Radio, Input, Textarea, useFormValidation, required, maxLength, pattern } from "@voyzu/ui-components";
import styles from "./customer-detail.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { CustomerConfigurationInput, CustomerConfigurationKind } from "../types/customer-configuration.dto";
export const emptyConfiguration = (): CustomerConfigurationInput => ({ code: "", name: "", description: "", direction: "decrease", method: "percentage", value: 0 });
export function useConfigurationValidation(value: CustomerConfigurationInput) {
  return useFormValidation(() => ({
    code: { label: "code", value: value.code, rules: [required(), maxLength(50), pattern(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "Use letters, numbers, hyphens or underscores for the code")] },
    name: { label: "name", value: value.name, rules: [required(), maxLength(100)] },
    description: { label: "description", value: value.description, rules: [maxLength(2000)] },
    value: { label: value.method === "percentage" ? "percentage" : "amount", value: Number.isFinite(value.value) ? String(value.value) : "", rules: [required(), { kind: "format", test: (v) => Number(v) >= 0 && !(value.direction === "decrease" && value.method === "percentage" && Number(v) > 100), message: "Enter a non-negative adjustment. Percentage decreases cannot exceed 100%." }] },
  }));
}
export function CustomerConfigurationFields({ kind, value, onChange, pending, hasError, creating = false }: { kind: CustomerConfigurationKind; value: CustomerConfigurationInput; onChange: (value: CustomerConfigurationInput) => void; pending: boolean; hasError: (key: string) => boolean; creating?: boolean }) {
  return <><div className={detail.formGrid}>{(["code", "name"] as const).map((key) => <div className={detail.fieldGroup} key={key}><label className={typography.fieldLabel} htmlFor={"config-" + key}>{key === "code" ? "Code" : "Name"}</label><Input id={"config-" + key} value={value[key]} disabled={pending || (key === "code" && !creating)} invalid={hasError(key)} onChange={(e) => onChange({ ...value, [key]: key === "code" ? e.target.value.toUpperCase() : e.target.value })} /></div>)}</div>
    <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="config-description">Description</label><Textarea id="config-description" value={value.description} disabled={pending} invalid={hasError("description")} onChange={(e) => onChange({ ...value, description: e.target.value })} /></div>
    {kind === "priceLists" && <section className={detail.dividedStack}>
      <h3 className={typography.sectionHeading}>Pricing Adjustment</h3>
      <fieldset className={styles.radioChoices} disabled={pending}><legend className={typography.fieldLabel}>Adjustment</legend><label><Radio name="customer-pricing-direction" checked={value.direction === "increase"} onChange={() => onChange({ ...value, direction: "increase" })} /> Increase prices</label><label><Radio name="customer-pricing-direction" checked={value.direction === "decrease"} onChange={() => onChange({ ...value, direction: "decrease" })} /> Decrease prices</label></fieldset>
      <fieldset className={styles.radioChoices} disabled={pending}><legend className={typography.fieldLabel}>Adjust By</legend><label><Radio name="customer-pricing-method" checked={value.method === "percentage"} onChange={() => onChange({ ...value, method: "percentage" })} /> By Percentage</label><label><Radio name="customer-pricing-method" checked={value.method === "amount"} onChange={() => onChange({ ...value, method: "amount" })} /> By Amount</label></fieldset>
      <div className={detail.fieldGroup + " " + styles.adjustmentField}><label className={typography.fieldLabel} htmlFor="customer-adjustment-value">{value.method === "percentage" ? "Percentage" : "Amount"}</label><Input id="customer-adjustment-value" type="number" decimalPlaces={2} min={0} value={Number.isFinite(value.value) ? value.value : ""} disabled={pending} invalid={hasError("value")} onChange={(e) => onChange({ ...value, value: e.target.value === "" ? NaN : Number(e.target.value) })} /></div>
      <p className={typography.bodyText}>This adjustment is applied when calculating prices for customers assigned to this price list. Product base prices remain unchanged.</p>
    </section>}
  </>;
}
