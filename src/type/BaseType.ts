/**
 * The base enumeration class that implements iterable and does string interpolation
 */
export default function BaseType<T>() {
    abstract class BaseType {
        public static fromType(type: string): T | undefined {
            // @ts-ignore
            return this.enumeration.find((enumType: T) => enumType.type === type);
        }

        public static [Symbol.iterator]() {
            return this.enumeration[Symbol.iterator]();
        }

        public static map(callback: (item: T, index: number) => any) {
            return this.enumeration.map(callback);
        }

        protected static enumeration: T[];

        protected static toEnumeration(): T[] {
            const enumeration = [];
            for (const [key, value] of Object.entries(this)) {
                value.type = key;
                enumeration.push(value);
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
