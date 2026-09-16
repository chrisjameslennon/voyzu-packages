"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ValidationAlert } from "@voyzu/ui-components";
import { ProductModal as CustomerModal } from "../../products/client/ProductModal";
import { customerConfigurationMeta, type CustomerConfigurationKind } from "../types/customer-configuration.dto";
import { saveCustomerConfigurationAction } from "../server/actions/customer-configuration.actions";
import { CustomerConfigurationFields, useConfigurationValidation, emptyConfiguration } from "./CustomerConfigurationFields";
export function AddCustomerConfigurationModal({ onClose, kind }: { onClose: () => void; kind: CustomerConfigurationKind }) {
  const router = useRouter();
  const meta = customerConfigurationMeta[kind];
  const [value, setValue] = useState(emptyConfiguration);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const validation = useConfigurationValidation(value);
  const save = () => {
    setError(""); if (!validation.attempt()) return;
    startTransition(async () => {
      try { const result = await saveCustomerConfigurationAction(kind, value); if (!result.record) { setError(result.error ?? "Unable to create."); return; } router.push(meta.href + "/" + encodeURIComponent(result.record.code)); router.refresh(); onClose(); }
      catch { setError("Unable to create. Please try again."); }
    });
  };
  return <CustomerModal title={"Add " + meta.singular} submitLabel={"Create " + meta.singular} pending={pending} onClose={onClose} onSubmit={save}>
    <ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} />
    <CustomerConfigurationFields kind={kind} value={value} onChange={setValue} pending={pending} hasError={validation.hasError} creating />
  </CustomerModal>;
}
