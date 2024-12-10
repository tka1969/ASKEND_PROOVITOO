export type IQueryIndexMap<T> = {
	[key in string]: T;
  };
  
export interface QueryModel {
	parameters?: IQueryIndexMap<any>;
}

export function createQueryModel(query?: Partial<QueryModel>): QueryModel {
	const defaultValue: QueryModel = {
	};  
	return {
    	...defaultValue,
    	...query,
	}
}

export function queryKey(prefix: string, query?: QueryModel): string {
	let cacheKey = prefix;
	let cacheKeyCount = 0;

	if (query) {
		for (const pkey in query.parameters)
		{
	   		const indexedItem: string = (typeof query.parameters[pkey] === 'string') ? query.parameters[pkey] : JSON.stringify(query.parameters[pkey]);
			cacheKey += '::' + indexedItem.toLowerCase();
			cacheKeyCount++;
		}
	}
	if (cacheKeyCount == 0) {
		cacheKey += '::all';
	}
    return cacheKey;
}
