export interface CurrencyCreateRequestDto {
  /** Stable currency code. */
  code: string;
  /** Currency display name. */
  name: string;
  /** Currency symbol used for display. */
  symbol?: string | null;
}
