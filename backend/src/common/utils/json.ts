/**
 * Custom JSON serializer utility to safely serialize BigInt values to string
 * This prevents TypeError: Do not know how to serialize a BigInt in Express res.json()
 */
export function setupBigIntSerialization(): void {
  (BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
    return this.toString();
  };
}

setupBigIntSerialization();
