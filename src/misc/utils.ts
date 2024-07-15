export const splitQueryText = (query: string) =>
  query
    .split(";")
    .map((query) => query.trim())
    .filter((query) => query.length > 0)
    .join(";\n");
