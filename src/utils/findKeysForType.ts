/**
 * Searches an object for its keys that have values of the given type.
 * Does _not_ search arrays.
 *
 * @param object the object to search
 * @param type the type of value to search for
 * @returns a list of keys with values of the given type
 */
export function findKeysForType(
  object: Record<string, any>,
  type: "string" | "number" | "boolean"
): string[] {
  const keys: string[] = [];

  const keyValuesToVisit: [string, unknown][] = Object.entries(object);
  while (keyValuesToVisit.length) {
    const keyValue = keyValuesToVisit.pop();
    if (!keyValue) {
      break;
    }
    const [key, value] = keyValue;
    if (typeof value === type) {
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
