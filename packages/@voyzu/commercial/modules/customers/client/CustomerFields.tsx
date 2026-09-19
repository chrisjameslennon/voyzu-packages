"use client";
import { Checkbox, SearchableSelect, Input, Textarea, useFormValidation, required, maxLength, pattern } from "@voyzu/ui-components";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { addressTypes, emptyAddress, synchronizeCustomerAddresses, type CustomerInput } from "../types/customer.dto";
export function useCustomerValidation(value: CustomerInput) {
  return useFormValidation(() => ({
    code: { label: "customer code", value: value.code, rules: [required(), maxLength(50), pattern(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "Use letters, numbers, hyphens or underscores for the customer code")] },
    name: { label: "name", value: value.name, rules: [required(), maxLength(200)] },
    primaryContactName: { label: "primary contact name", value: value.primaryContactName, rules: [maxLength(200)] },
    email: { label: "email", value: value.email, rules: [maxLength(254), pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Supply a valid email address")] },
    notes: { label: "notes", value: value.notes, rules: [maxLength(5000)] },
    ...Object.fromEntries(value.addresses.flatMap((address) => addressFields.map(([key, label, limit]) => [address.address_type + "." + key, { label: address.address_type.toLowerCase() + " " + label.toLowerCase(), value: address[key], rules: key === "country_code" ? [pattern(/^[A-Z]{2}$/, "Use a two-letter country code")] : [maxLength(limit)] }]))),
  }));
}
const addressFields = [
  ["address_line_1", "Address Line 1", 200], ["address_line_2", "Address Line 2", 200],
  ["city", "City", 100], ["region_or_state", "Region or State", 100],
  ["postal_code", "Postal Code", 20], ["country_code", "Country Code", 2],
] as const;
export function CustomerFields({ value, onChange, pending, hasError, creating = false, categories, priceLists }: { categories: { code: string; name: string; status: string }[]; priceLists: { code: string; name: string; status: string }[]; value: CustomerInput; onChange: (value: CustomerInput) => void; pending: boolean; hasError: (key: string) => boolean; creating?: boolean }) {
  return <>
    <div className={detail.formGrid}>{([
      ["code", "Customer Code"], ["name", "Name"], ["primaryContactName", "Primary Contact Name"], ["email", "Email"],
    ] as const).map(([key, label]) => <div className={detail.fieldGroup} key={key}><label className={typography.fieldLabel} htmlFor={"customer-" + key}>{label}</label><Input id={"customer-" + key} type={key === "email" ? "email" : "text"} disabled={pending || (key === "code" && !creating)} invalid={hasError(key)} value={value[key]} onChange={(event) => onChange({ ...value, [key]: key === "code" ? event.target.value.toUpperCase() : event.target.value })} /></div>)}</div>
    <div className={detail.formGrid}>{([["categoryCode", "Customer Category", categories], ["priceListCode", "Customer Price List", priceLists]] as const).map(([key, label, rows]) => <div className={detail.fieldGroup} key={key}><span className={typography.fieldLabel}>{label}</span><SearchableSelect ariaLabel={label} value={value[key] ?? ""} clearable disabled={pending} options={rows.filter((row) => row.status === "ACTIVE" || row.code === value[key]).map((row) => ({ value: row.code, label: row.name }))} onChange={(code) => onChange({ ...value, [key]: code || null })} placeholder={"Select a " + label.toLowerCase()} /></div>)}</div>
    {!creating && <>
      {addressTypes.map((type) => {
        const address = value.addresses.find((row) => row.address_type === type) ?? emptyAddress(type);
        return <section className={detail.dividedStack} key={type}><h3 className={typography.sectionHeading}>{type === "SHIPPING" ? "Shipping Address" : "Postal Address"}</h3>{type === "SHIPPING" && <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Checkbox checked={value.usePostalAddressForShipping} disabled={pending} onChange={(checked) => onChange(synchronizeCustomerAddresses({ ...value, usePostalAddressForShipping: checked }))} />Use postal address</label>}{!(type === "SHIPPING" && value.usePostalAddressForShipping) && <div className={detail.formGrid}>{addressFields.map(([key, label]) => <div className={detail.fieldGroup} key={key}><label className={typography.fieldLabel} htmlFor={type + key}>{label}</label><Input id={type + key} disabled={pending} invalid={hasError(type + "." + key)} value={address[key]} placeholder={key === "country_code" ? "e.g. NZ" : undefined} onChange={(event) => { const next = { ...address, [key]: key === "country_code" ? event.target.value.toUpperCase() : event.target.value }; onChange(synchronizeCustomerAddresses({ ...value, addresses: addressTypes.map((role) => role === type ? next : value.addresses.find((row) => row.address_type === role) ?? emptyAddress(role)) })); }} /></div>)}</div>}</section>;
      })}
      <section className={detail.dividedStack}><h3 className={typography.sectionHeading}>Notes</h3><div className={detail.fieldGroup}><Textarea aria-label="Notes" id="customer-notes" disabled={pending} invalid={hasError("notes")} value={value.notes} onChange={(event) => onChange({ ...value, notes: event.target.value })} /></div></section>
    </>}
  </>;
}
