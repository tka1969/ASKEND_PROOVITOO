import { IResourceBaseObject } from "../types/resource.type";

export interface IParameter extends IResourceBaseObject {
	parameterClass: string;
	property: string;
	name: string;
	description?: string;
	stringValue1?: string;
	intValue1?: number,
	intValue2?: number
	validFrom?: Date;
    validUntil?: Date;
}
