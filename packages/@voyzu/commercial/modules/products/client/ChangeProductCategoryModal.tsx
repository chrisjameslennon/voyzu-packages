"use client";
import { useState, useTransition } from "react";
import { SearchableSelect, ValidationAlert, useFormValidation, required } from "@voyzu/ui-components";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { ProductModal } from "./ProductModal";
import { changeProductsCategoryAction } from "../server/actions/product.actions";

export function ChangeProductCategoryModal({ kind, codes, options, onClose, onSaved }: { kind: "category" | "pricingCategory"; codes: string[]; options: { code: string; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const label = kind === "category" ? "Category" : "Pricing Category";
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const validation = useFormValidation(() => ({ category: { label: "new " + label.toLowerCase(), value, rules: [required()] } }));
  const save = () => {
    setError("");
    if (!validation.attempt()) return;
    startTransition(async () => {
      try {
        const result = await changeProductsCategoryAction(codes, kind, value);
        if (result.error) { setError(result.error); return; }
        onSaved();
      } catch { setError("Unable to update products. Please try again."); }
    });
  };
  return <ProductModal title={"Change " + label} submitLabel={"Change " + label} pending={pending} onClose={onClose} onSubmit={save}>
    <ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} />
    <p>{codes.length} {codes.length === 1 ? "product" : "products"} will be affected.</p>
    <div className={detail.fieldGroup}><span className={typography.fieldLabel}>{"New " + label}</span><SearchableSelect ariaLabel={"New " + label} value={value} onChange={setValue} options={options.map((row) => ({ value: row.code, label: row.name }))} placeholder={"Select a " + label.toLowerCase()} hasError={validation.hasError("category")} disabled={pending} /></div>
  </ProductModal>;
}
