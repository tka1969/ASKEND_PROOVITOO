import { ActionEnum } from "../enums/action.enum";


export interface IDialogParameter {
	action?: ActionEnum;
	data?: any;
}

export function createDialogParameter(query?: Partial<IDialogParameter>): IDialogParameter {
	const defaultValue: IDialogParameter = {
	};  
	return {
    	...defaultValue,
    	...query,
	}
}
