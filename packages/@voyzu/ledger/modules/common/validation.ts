export type FieldValidator<T> = (value: T) => string | null;

export type FieldValidators<T extends object> = {
  [K in keyof T]-?: FieldValidator<T[K]>;
};

export function validateFields<T extends object>(
  input: T,
  validators: FieldValidators<T>,
): string[] {
  return (Object.keys(validators) as Array<keyof T>).flatMap((key) => {
    try {
      const error = validators[key](input[key]);
      return error === null ? [] : [error];
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      return [`${String(key)} could not be validated: ${detail}`];
    }
  });
}
