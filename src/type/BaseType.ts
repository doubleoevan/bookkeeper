/**
 * The base enumeration class that implements iterable and does string interpolation
 */
export default function BaseType<T>() {
    abstract class BaseType {
        public static fromType(type: string): T | undefined {
            return this.enumeration.get(type);
        }

        public static [Symbol.iterator]() {
            const types = [...this.enumeration.values()];
            return types[Symbol.iterator]();
        }

        public static map(callback: (item: T, index: number) => any) {
            const types = [...this.enumeration.values()];
            return types.map(callback);
        }

        protected static enumeration: Map<string, T>;

        protected static toEnumeration(): Map<string, T> {
            const enumeration = new Map<string, T>();
            for (const [key, value] of Object.entries(this)) {
                value.type = key;
                enumeration.set(key, value as T);
            }
            return this.enumeration = enumeration;
        }

        public type: string = 'Error: Missing type! Please call toEnumeration() after initialization';

        public toString(): string {
            return this.type;
        }
    }

    return BaseType;
}
