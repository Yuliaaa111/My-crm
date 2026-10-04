export const isOneOf = <Option extends string>(
  value: string,
  options: readonly Option[],
): value is Option => options.some((option) => option === value);
