import { getVersion } from "../utility/utility-helpers";
import { ResourceType } from "./resource.type";


export interface ISignalResource<T> {
  version: number;
  payload: ResourceType<T>[];
}
  
export function createSignalResource<T>(resource?: Partial<ISignalResource<T>>): ISignalResource<T> {
  const defaultValue: ISignalResource<T> = {
      version: getVersion(),
      payload: [],
  };  
  return {
      ...defaultValue,
      ...resource,
  }
}
