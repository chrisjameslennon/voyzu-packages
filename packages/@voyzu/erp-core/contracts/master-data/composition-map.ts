/** References contracts by identity, never imports another owner's schema/provider. */
export const masterDataCompositions = {
  "erp.country": {
    root: "platform.country",
    extensions: ["erp.country.finance"],
  },
} as const;
