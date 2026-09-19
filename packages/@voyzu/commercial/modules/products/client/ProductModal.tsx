"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@voyzu/ui-components";
import modal from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./product-detail.module.css";
export function ProductModal({ title, children, pending, onClose, onSubmit, submitLabel, wide = false }: { title: string; children: ReactNode; pending: boolean; onClose: () => void; onSubmit: () => void; submitLabel: string; wide?: boolean }) {
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(() => { ref.current?.showModal(); }, []);
 return <dialog ref={ref} className={modal.modal + " " + styles.standardDialog} style={wide ? { maxWidth: "72rem" } : undefined} aria-label={title} onCancel={(event) => { event.preventDefault(); if (!pending) onClose(); }}>
  <div className={modal.header}><h2 className={typography.contentTitle}>{title}</h2><Button variant="plain" icon="close" aria-label="Close" disabled={pending} onClick={onClose} /></div>
  <div className={modal.body}>{children}</div>
  <div className={modal.footer}><Button variant="cancel" disabled={pending} onClick={onClose}>Cancel</Button><Button variant="primary" disabled={pending} onClick={onSubmit}>{pending ? "Saving..." : submitLabel}</Button></div>
 </dialog>;
}
