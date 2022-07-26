/**
 * Searches an object for its keys that have string values.
 * Does _not_ search arrays.
 *
 * @param object the object to search
 * @returns a list of keys with string values
 */
export function findStringKeys(object: Record<string, any>): string[] {
  const keys: string[] = [];

  const keyValuesToVisit: [string, unknown][] = Object.entries(object);
  while (keyValuesToVisit.length) {
    const keyValue = keyValuesToVisit.pop();
    if (!keyValue) {
      break;
    }
    const [key, value] = keyValue;
    if (typeof value === "string") {
      keys.push(key);
    } else if (value && !Array.isArray(value) && typeof value === "object") {
      keyValuesToVisit.push(
        ...Object.entries(value).map(
          ([childKey, value]) =>
            [`${key}.${childKey}`, value] as [string, unknown]
        )
      );
    }
  }

  return keys;
}
