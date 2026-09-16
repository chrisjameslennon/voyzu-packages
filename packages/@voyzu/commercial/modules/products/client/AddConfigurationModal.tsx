"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, ValidationAlert, useFormValidation, required, maxLength, pattern } from "@voyzu/ui-components";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { ProductModal } from "./ProductModal";
import { saveConfigurationAction } from "../server/actions/product-configuration.actions";
import { configurationMeta, type ProductConfigurationKind } from "../types/product-configuration.dto";
export function AddConfigurationModal({ kind, onClose }: { kind: Exclude<ProductConfigurationKind, "lists">; onClose: () => void }) {
 const router=useRouter(), meta=configurationMeta[kind]; const [code,setCode]=useState(""); const [name,setName]=useState(""); const [description,setDescription]=useState(""); const [error,setError]=useState(""); const [pending,startTransition]=useTransition();
 const validation=useFormValidation(() => ({ code:{label:"code",value:code,rules:[required(),maxLength(50),pattern(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "Use letters, numbers, hyphens or underscores for the code")]}, name:{label:"name",value:name,rules:[required(),maxLength(100)]}, description:{label:"description",value:description,rules:[maxLength(2000)]} }));
 const save=()=>{setError("");if(!validation.attempt())return;startTransition(async()=>{try{const result=await saveConfigurationAction(kind,{code:code.trim(),name:name.trim(),description,values:[]});if(!result.record){setError(result.error??"Unable to create.");return;}router.push(meta.href+"/"+encodeURIComponent(result.record.code));router.refresh();onClose();}catch{setError("Unable to create. Please try again.");}});};
 return <ProductModal title={"Add "+meta.singular} submitLabel={"Create "+meta.singular} pending={pending} onClose={onClose} onSubmit={save}>
 <ValidationAlert errors={[...(validation.showErrors?validation.errors:[]),...(error?[error]:[])]} visible={validation.showErrors||!!error} onDismiss={()=>{validation.dismiss();setError("");}} />
 <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="configuration-code">Code</label><Input id="configuration-code" disabled={pending} invalid={validation.hasError("code")} value={code} onChange={(e)=>setCode(e.target.value.toUpperCase())}/></div>
 <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="configuration-name">Name</label><Input id="configuration-name" disabled={pending} invalid={validation.hasError("name")} value={name} onChange={(e)=>setName(e.target.value)}/></div>
 <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="configuration-description">Description</label><Textarea id="configuration-description" disabled={pending} invalid={validation.hasError("description")} value={description} onChange={(e)=>setDescription(e.target.value)}/></div>
 {kind!=="categories"&&<p className={typography.bodyText}>Add values on the next screen.</p>}
 </ProductModal>;
}
