export interface CurrencyUpdateRequestDto {
  /** Currency display name. */
  name: string;
  /** Currency symbol used for display. */
  symbol?: string | null;
}
