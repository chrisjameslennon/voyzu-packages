export interface DimensionPatchRequestDto {
  /** Business code for the dimension (up to 14 characters, uppercase letters, numbers, dash, underscore). */
  code?: string;
  /** Display name of the dimension. */
  name?: string;
}
