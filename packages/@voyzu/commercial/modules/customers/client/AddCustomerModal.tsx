"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ValidationAlert } from "@voyzu/ui-components";
import { ProductModal as CustomerModal } from "../../products/client/ProductModal";
import type { CustomerConfiguration } from "../types/customer-configuration.dto";
import { emptyCustomer } from "../types/customer.dto";
import { saveCustomerAction } from "../server/actions/customer.actions";
import { CustomerFields, useCustomerValidation } from "./CustomerFields";
export function AddCustomerModal({ onClose, categories, priceLists }: { onClose: () => void; categories: CustomerConfiguration[]; priceLists: CustomerConfiguration[] }) {
  const router = useRouter();
  const [value, setValue] = useState(emptyCustomer);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const validation = useCustomerValidation(value);
  const save = () => {
    setError(""); if (!validation.attempt()) return;
    startTransition(async () => {
      try { const result = await saveCustomerAction(value); if (!result.customer) { setError(result.error ?? "Unable to create customer."); return; } router.push("/commercial/customers/" + encodeURIComponent(result.customer.code)); router.refresh(); onClose(); }
      catch { setError("Unable to create customer. Please try again."); }
    });
  };
  return <CustomerModal title="Add Customer" submitLabel="Create Customer" pending={pending} onClose={onClose} onSubmit={save}>
    <ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} />
    <CustomerFields categories={categories} priceLists={priceLists} value={value} onChange={setValue} pending={pending} hasError={validation.hasError} creating />
  </CustomerModal>;
}
