import { IResourceBaseObject } from "../types/resource.type";
import { IFilterCriteria } from "./filter-criteria";


export const enum SomeSelectionEnum {
    SEL_1 = 'SEL_1',
    SEL_2 = 'SEL_2',
    SEL_3 = 'SEL_3',
}

export interface IFilter extends IResourceBaseObject {
    name: string;
	someSelection: SomeSelectionEnum;
    criterias: IFilterCriteria[];
}

export function createFilter(query?: Partial<IFilter>): IFilter {
	const defaultValue: IFilter = {
        id: 0,
		name: "",
		someSelection: SomeSelectionEnum.SEL_1,
		criterias: [],
		};  
	return {
    	...defaultValue,
    	...query,
	}
}
