export const isJsonValid = (json: string): boolean => {
  if (!json) {
    return false;
  }

  try {
    JSON.parse(json);
    return true;
  } catch (_: unknown) {
    return false;
  }
};
