import { IResourceBaseObject } from "../types/resource.type";

export interface IFilterCriteria extends IResourceBaseObject {
    filterId?: bigint;
    criteriaId?: bigint;
    conditionTypeId?: bigint;
    conditionValue?: string;
}

export function createFilterCriteria(query?: Partial<IFilterCriteria>): IFilterCriteria {
	const defaultValue: IFilterCriteria = {
        id: 0,
		criteriaId: undefined,
		conditionTypeId: undefined,
		conditionValue: undefined,
	};  
	return {
    	...defaultValue,
    	...query,
	}
}
