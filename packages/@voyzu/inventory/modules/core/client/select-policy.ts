export const SEARCHABLE_SELECT_THRESHOLD = 15;

export const isSelectSearchable = (optionCount: number) =>
  optionCount > SEARCHABLE_SELECT_THRESHOLD;
