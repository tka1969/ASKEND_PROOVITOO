
export type GUID = string & { isGuid: true};

export class Guid {

    public static validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    public static EMPTY = "00000000-0000-0000-0000-000000000000";

    public static isGuid(guid: any) {
        const value: string = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    }

    public static isGuidEmpty(guid: GUID): boolean {
        return guid === Guid.EMPTY;
    }
        
    public static createGUID(): GUID {
        return crypto.randomUUID() as GUID;
    }

    public static create(): Guid {
        return new Guid(crypto.randomUUID());
    }

    public static createEmpty(): Guid {
        return new Guid(Guid.EMPTY);
    }

    public static createEmptyGUID(): GUID {
        return new Guid(Guid.EMPTY).toGUID();
    }

    public static parse(guid: string): Guid {
        return new Guid(guid);
    }

    public static raw(): string {
        return crypto.randomUUID();
    }

    private value: string;

    private constructor(guid: string) {
        if (!guid) { throw new TypeError("Invalid argument; `value` has no value."); }

        this.value = Guid.EMPTY;

        if (guid && Guid.isGuid(guid)) {
            this.value = guid;
        }
    }

    public equals(other: Guid): boolean {
        return Guid.isGuid(other) && this.value === other.toString();
    }

    public isEmpty(): boolean {
        return this.value === Guid.EMPTY;
    }

    public toString(): string {
        return this.value;
    }

    public toJSON(): any {
        return {
            value: this.value,
        };
    }

    public toGUID(): GUID {
        return this.value as GUID;
    }
}
