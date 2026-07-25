export interface DimensionCreateRequestDto {
  /** Business code for the new dimension (up to 14 characters, uppercase letters, numbers, dash, underscore). */
  code: string;
  /** Display name of the dimension. */
  name: string;
}
