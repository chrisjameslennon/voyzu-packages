"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Button, EditableGrid, Input, SearchableSelect, type EditableGridColumn } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/document-entry.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./new-invoice.module.css";

type InvoiceLine = { id: number; product: string; price: number | ""; quantity: number | "" };
const customers = [
  { value: "ACME", label: "Acme Design Partners", code: "ACME" },
  { value: "GLOBAL", label: "Global Trade NZ Ltd", code: "GLOBAL" },
  { value: "KIWI", label: "Kiwi Financial Services", code: "KIWI" },
  { value: "HARBOUR", label: "Harbour Retail Group", code: "HARBOUR" },
];
const columns: EditableGridColumn<InvoiceLine>[] = [
  {
    key: "product", label: "Sales Item", type: "select", width: 400, searchable: true,
    options: [
      { value: "COFFEE", label: "Premium Coffee Beans", code: "COFFEE" },
      { value: "BOX", label: "Gift Shipping Box", code: "BOX" },
      { value: "GIFT", label: "Coffee Gift Set", code: "GIFT" },
      { value: "MUG", label: "Ceramic Coffee Mug", code: "MUG" },
    ],
  },
  { key: "price", label: "Price", type: "number", width: 160 },
  { key: "quantity", label: "Qty", type: "number", width: 112 },
];
const initialLines: InvoiceLine[] = [{ id: 1, product: "", price: "", quantity: "" }];

export function NewInvoice() {
  const router = useRouter();
  const nextId = useRef(2);
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className={layout.documentEntryView}>
      <header className={layout.documentEntryHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>New Invoice</h1>
            <p className={typography.headingByline}>Create a customer invoice with sales items, prices and quantities.</p>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <Button variant="cancel" onClick={() => router.push("/finance/operations/accounts-receivable/invoices")}>Cancel</Button>
            <Button variant="primary">Create Invoice</Button>
          </div>
        </div>
      </header>
      <aside className={layout.slotDocument}>
        <div className={styles.documentPanel}>
          <div className={styles.documentPanelLabel}>Invoice Document</div>
          <div className={styles.documentPanelFields}>
            <div className={styles.field}>
              <label className={typography.fieldLabel} htmlFor="invoice-date">Date</label>
              <Input id="invoice-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={typography.fieldLabel} htmlFor="invoice-reference">Reference (optional)</label>
              <Input id="invoice-reference" value={reference} onChange={(event) => setReference(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={typography.fieldLabel} htmlFor="invoice-notes">Notes (optional)</label>
              <textarea id="invoice-notes" className={styles.textarea} value={notes} onChange={(event) => setNotes(event.target.value)} />
            </div>
          </div>
        </div>
      </aside>
      <main className={layout.slotMain}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Invoice Details</h2>
          <div className={styles.field}>
            <label className={typography.fieldLabel}>Customer</label>
            <SearchableSelect value={customer} onChange={setCustomer} options={customers} searchable placeholder="Select a customer" ariaLabel="Customer" />
          </div>
          <div className={styles.linesSection}>
            <h2 className={typography.sectionHeading}>Invoice Lines</h2>
            <EditableGrid
              columns={columns}
              initialRows={initialLines}
              allowAddRows
              allowDeleteRows
              createRow={(): InvoiceLine => ({ id: nextId.current++, product: "", price: "", quantity: "" })}
              addRowLabel="Add Line"
              emptyText="No invoice lines have been added"
              ariaLabel="Invoice lines"
              mobileLayout="cards"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
