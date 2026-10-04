export const buildDetailsPath = (listPath: string, entityId: string): string =>
  `${listPath}/${encodeURIComponent(entityId)}`;
