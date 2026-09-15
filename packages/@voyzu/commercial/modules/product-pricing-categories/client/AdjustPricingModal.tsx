"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button, Input, Radio, ValidationAlert, useFormValidation, required } from "@voyzu/ui-components";
import modal from "@voyzu/ui-style/css-modules/modal.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./pricing-categories.module.css";
import type { PricingCategory, PricingAdjustment } from "../types/pricing-category.dto";
import { pricingAdjustmentAction } from "../server/actions/pricing-category.actions";
export function AdjustPricingModal({ categories, initialCodes, onClose, onAdjusted }: { categories: PricingCategory[]; initialCodes: string[]; onClose: () => void; onAdjusted: (message: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  const codes = initialCodes;
  const [direction, setDirection] = useState<PricingAdjustment["direction"]>("increase");
  const [method, setMethod] = useState<PricingAdjustment["method"]>("percentage");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<{ count: number; signature: string; names: string[] } | null>(null);
  const validation = useFormValidation(() => ({
    categories: { label: "pricing category", value: codes.join(","), rules: [required()] },
    value: { label: method === "percentage" ? "percentage" : "amount", value, rules: [required(), { kind: "format", test: (text) => Number.isFinite(Number(text)) && Number(text) > 0 && !(direction === "decrease" && method === "percentage" && Number(text) > 100), message: "Enter a positive adjustment. Percentage decreases cannot exceed 100%." }] },
  }));
  const submit = () => {
    setError(""); if (!validation.attempt()) return;
    startTransition(async () => {
      try {
        const result = await pricingAdjustmentAction({ codes, direction, method, value: Number(value) }, preview?.signature);
        if (!("count" in result)) { setError(result.error ?? "Unable to adjust pricing."); return; }
        if (preview) { onAdjusted("Base prices adjusted for " + result.count + " products"); return; }
        setPreview({ count: result.count, signature: result.signature, names: result.names });
      } catch { setError("Unable to adjust pricing. Please try again."); }
    });
  };
  return <dialog ref={ref} className={modal.modal + " " + styles.dialog} aria-label="Adjust Pricing" onCancel={(event) => { event.preventDefault(); if (!pending) onClose(); }}>
    <div className={modal.header}><h2 className={typography.contentTitle}>{preview ? "Confirm Pricing Adjustment" : "Adjust Pricing"}</h2><Button variant="plain" icon="close" aria-label="Close" disabled={pending} onClick={onClose} /></div>
    <div className={modal.body}>
      <ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} />
      {preview ? <p className={typography.bodyText}>{direction === "increase" ? "Increase" : "Decrease"} base prices of {preview.count} {preview.count === 1 ? "product" : "products"} across {preview.names.length} pricing {preview.names.length === 1 ? "category" : "categories"} ({preview.names.join(", ")}) by {method === "percentage" ? value + "%" : "$" + Number(value).toFixed(2)}.</p> : <>
        <span className={typography.fieldLabel}>Pricing Categories</span>
        <ul className={typography.bodyText}>{categories.filter((category) => codes.includes(category.code)).map((category) => <li key={category.code}>{category.name}</li>)}</ul>
        <fieldset className={styles.radioChoices} disabled={pending}><legend className={typography.fieldLabel}>Adjustment</legend><label><Radio name="pricing-direction" checked={direction === "increase"} onChange={() => setDirection("increase")} /> Increase prices</label><label><Radio name="pricing-direction" checked={direction === "decrease"} onChange={() => setDirection("decrease")} /> Decrease prices</label></fieldset>
        <fieldset className={styles.radioChoices} disabled={pending}><legend className={typography.fieldLabel}>Adjust By</legend><label><Radio name="pricing-method" checked={method === "percentage"} onChange={() => setMethod("percentage")} /> By Percentage</label><label><Radio name="pricing-method" checked={method === "amount"} onChange={() => setMethod("amount")} /> By Amount</label></fieldset>
        <div className={detail.fieldGroup + " " + styles.adjustmentField}><label htmlFor="adjustment-value" className={typography.fieldLabel}>{method === "percentage" ? "Percentage" : "Amount"}</label><Input id="adjustment-value" type="number" decimalPlaces={2} min="0" step="0.01" invalid={validation.hasError("value")} value={value} disabled={pending} onChange={(event) => setValue(event.target.value)} /></div>
      </>}
    </div>
    <div className={modal.footer}><Button variant="cancel" disabled={pending} onClick={onClose}>Cancel</Button><Button variant="primary" disabled={pending} onClick={submit}>{pending ? "Please wait..." : preview ? "Adjust prices" : "Confirm >"}</Button></div>
  </dialog>;
}
