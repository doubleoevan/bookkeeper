// @ts-nocheck

/**
 * The base enumeration class that implements iterable and does string interpolation
 */
export default abstract class BaseType<T extends BaseType> {
    public static fromType(type: string) {
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

    public type: string;

    public toString(): string {
        return this.type;
    }
}
