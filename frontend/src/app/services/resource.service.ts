import { signal } from "@angular/core";
import { CallState, FetchingState, IErrorState } from "../types/call-state.type";
import { ResourceType } from "../types/resource.type";
import { getVersion } from "../utility/utility-helpers";
import { ISignalResource, createSignalResource } from "../types/signal-resource.type";


export class ResourceService<T> {
  resources = signal<ISignalResource<T>>(createSignalResource());
  state = signal<CallState>(FetchingState.EMPTY);

  constructor() {
  }

  public getResources = (): ISignalResource<T> => {
    return this.resources();
  };

  public isLoading = (): boolean => {
    return this.state() == FetchingState.LOADING;
  };

  public isLoaded = (): boolean => {
    return this.state() == FetchingState.LOADED;
  };

  public isError = (): boolean => {
    return (this.state() as IErrorState).errorMsg !== undefined;
  };

  public getError = (): string | null => {
      if ((this.state() as IErrorState).errorMsg !== undefined) {
          return (this.state() as IErrorState).errorMsg;
      }
      return null;
  };

//===========================================
// protected set*
//===========================================
public setLoading = () => {
    this.state.set(FetchingState.LOADING);
  };

  public setLoaded = () => {
    this.state.set(FetchingState.LOADED);
  };

  public setError = (error: any) => {
    this.state.set({errorMsg: error});
  };

  public refresh = () => {
    const resource: ISignalResource<T> = this.resources();
    this.resources.set(createSignalResource({version: getVersion(), payload: resource.payload}));
  };

  public setResources = (payload: ResourceType<T>[]) => {
    this.resources.set(createSignalResource({version: getVersion(), payload: payload}));
  };

  public getResource = (id: number | string): ResourceType<T> | undefined => {
    const resource: ISignalResource<T> = this.resources();
    return resource.payload.find((item: ResourceType<T>) => item.id === id);
  };

  public upsertResource = (payload: ResourceType<T>) => {
    const resource: ISignalResource<T> = this.resources();
    const index = resource.payload.findIndex((item: ResourceType<T>) => item.id === payload.id);

    if (index === -1) {
      resource.payload.push(payload);
      this.resources.set(createSignalResource({version: getVersion(), payload: resource.payload}));
    }
    else {
      resource.payload[index] = payload;
      this.resources.set(createSignalResource({version: getVersion(), payload: resource.payload}));
    }
  };

  public removeResource = (id: number | bigint | string) => {
    const resource: ISignalResource<T> = this.resources();
    const payload: ResourceType<T>[] = resource.payload.filter((item: ResourceType<T>) => item.id !== id);
    this.resources.set(createSignalResource({version: getVersion(), payload: payload}));
  };

  public cleanResource = () => {
    this.resources.set(createSignalResource({version: getVersion(), payload: []}));
  };  
}


export interface IResourceStateService {
  isLoading(): boolean;
  isLoaded(): boolean;
  isError(): boolean;
  getError(): string | null;
  setLoading(): void;
  setLoaded(): void;
}

export class ResourceStateService implements IResourceStateService {
  private readonly state = signal<CallState>(FetchingState.EMPTY);

  constructor() {
  }

  public isLoading = (): boolean => {
    return this.state() == FetchingState.LOADING;
  };

  public isLoaded = (): boolean => {
    return this.state() == FetchingState.LOADED;
  };

  public isError = (): boolean => {
    return (this.state() as IErrorState).errorMsg !== undefined;
  };

  public getError = (): string | null => {
      if ((this.state() as IErrorState).errorMsg !== undefined) {
          return (this.state() as IErrorState).errorMsg;
      }
      return null;
  };

  public setLoading = (): void => {
    this.state.set(FetchingState.LOADING);
  };

  public setLoaded = (): void => {
    this.state.set(FetchingState.LOADED);
  };

  public setError = (error: any): void => {
    this.state.set({errorMsg: error});
  };
}
