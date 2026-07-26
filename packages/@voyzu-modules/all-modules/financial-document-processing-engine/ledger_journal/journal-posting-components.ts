import { ComponentType } from "../core/journal-posting-components";
export default {
  description: "Ledger journals post caller-supplied debit and credit lines directly to the Company Ledger.",
  formula: "Dr Supplied GL lines = Cr Supplied GL lines",
  components: {
    dr_supplied_lines: {
      title: "Debit lines",
      side: "DR",
      type: ComponentType.DIRECT_GL,
      code: "CALLER_SUPPLIED_GL_ACCOUNT",
    },
    cr_supplied_lines: {
      title: "Credit lines",
      side: "CR",
      type: ComponentType.DIRECT_GL,
      code: "CALLER_SUPPLIED_GL_ACCOUNT",
    },
  },
} as const;
