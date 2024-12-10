
export declare type Nullable<T = void> = T | null | undefined;

export type IndexKeyMap<K extends string | number | symbol, V> = {
  [key in K]: V;
};

export type IndexMap<T> = {
  [key in string | number | symbol]: T | undefined;
};

export interface IVersionedObject {
    version?: number | string;
  }
    
export type VersionedType<T> = T & IVersionedObject;
