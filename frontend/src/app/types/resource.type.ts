import { DataRowOperation } from "../enums/data-row-operation.enum";
import { IVersionedObject } from "./common-types";


export interface IResourceBaseObject extends IVersionedObject {
  id: number | bigint;
  RowState?: DataRowOperation;
}
    
export type ResourceType<T> = T & IResourceBaseObject;
