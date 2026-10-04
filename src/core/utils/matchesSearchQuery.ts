export const matchesSearchQuery = (
  searchableValues: string[],
  searchQuery: string,
): boolean => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery === "") {
    return true;
  }

  return searchableValues.some((searchableValue) =>
    searchableValue.toLowerCase().includes(normalizedQuery),
  );
};
