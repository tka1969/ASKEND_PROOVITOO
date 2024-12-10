import { inject } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { ResourceService } from './resource.service';
import { BaseService } from './base.service';
import { CacheService } from './cache.service';
import { CacheItem } from '../models/cache-item.model';
import { ResourceType } from '../types/resource.type';
import { AlertService } from '../components/alert-panel/alert-panel.servic';
import { queryKey, QueryModel } from '../models/query.model';
import { getVersion } from '../utility/utility-helpers';


export const enum ServiceResultCode {
  COMPLETED = 0,
  ERROR = 1,
}

export interface IDataServiceOptions {
  refresh: boolean;
  relatinal: boolean;
  cache: boolean;
  parameterData?: any;
  documents: string[];

  cacheKey: string;
  keyprefix: string;
  name: string;

  path: string;
}

export interface IBaseDataService<T> {
  list(params?: QueryModel, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>[]>;
  get(id: number, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>>;
  add(param: ResourceType<T>, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>>;
  save(param: ResourceType<T>, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>>;
  delete(id: number, options?: Partial<IDataServiceOptions>): Observable<number>;
  get serviceName(): string;
};

export class BaseDataService<T> extends ResourceService<T> implements IBaseDataService<T> {
  private cacheService: CacheService = inject(CacheService);
  protected alertService: AlertService = inject(AlertService);
  private cacheKey: string = "";

  constructor(
    protected restService: BaseService<T>,
    private keyprefix: string,
    private _serviceName?: string
      ) {
    super();
  }

  public get serviceName() {
    return this._serviceName ?? "";
  };

  public getCacheService = (): CacheService => {
    return this.cacheService;
  };

  public cacheableCheckKey(key: string): void {
    if (key != this.cacheKey) {
      this.cacheService.remove(this.cacheKey);
      this.cacheKey = key;
    }
  }

  public getCacheKey = (): string => {
    return this.cacheKey;
  };

  private setCacheResource(resource: ResourceType<T>[], cacheKey: string, cache: boolean = true) {
    this.setResources(resource);

    if (cache) {
      const cacheItem: CacheItem<ResourceType<T>> = this.cacheService.put(cacheKey);
      cacheItem.setResources(resource);
    }
  }

  private upsertCacheResource(resource: ResourceType<T>, cacheKey: string, cache: boolean = true) {
    this.upsertResource(resource);

    if (cache) {
      const cacheItem: CacheItem<ResourceType<T>> = this.cacheService.put(cacheKey);
      cacheItem.upsertResource(resource);
    }
  }

  private removeCacheResource(id: number | bigint | string, cacheKey: string) {
    this.removeResource(id);
    const cacheItem: CacheItem<ResourceType<T>> | null = this.cacheService.get(cacheKey);
    if (cacheItem != null) {
      cacheItem.removeResource(id);
    }
  }

  public list(inquery: QueryModel, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>[]> {

    this.setLoading();

    const cacheKey = queryKey(this.keyprefix, inquery);

    this.cacheableCheckKey(cacheKey);

    const cacheItem: CacheItem<ResourceType<T>> | null = this.cacheService.get(this.cacheKey)
    if (options && (options.cache && !options.refresh) && cacheItem != null) {
      this.setResources(cacheItem.items);
      this.setLoaded();

      return of(cacheItem.items);
    }

    const observable = this.restService.list<ResourceType<T>>(inquery, options?.path);

    observable.subscribe({
        next: (result: ResourceType<T>[]) => {
          result.forEach(res => res.version = getVersion());
          this.setCacheResource(result, this.cacheKey, (options && options.cache) ?? false);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseDataService.query -> %o', error);
          this.setError(error);
        },
        complete: () => { 
          this.setLoaded();
        }
      });
      return observable;
  }

  public get(id: number | bigint | string, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>> {
    this.setLoading();

    const cacheItem: CacheItem<ResourceType<T>> | null = this.cacheService.get(this.cacheKey)
    if ((options && !options.refresh) && cacheItem != null) {
      const item: ResourceType<T> | undefined = cacheItem.items.find(item => item.id == id);

      if (item != undefined) {
        this.upsertResource(item);
        this.setLoaded();
        return of(item);
      }
    }

    const observable = this.restService.get<ResourceType<T>>(id);

    observable.subscribe({
        next: (result: ResourceType<T>) => {
          result.version = getVersion();
          this.upsertCacheResource(result, this.cacheKey, (options && options.cache) ?? false);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseDataService.get -> %o', error);
          this.setError(error);
        },
        complete: () => { 
          this.setLoaded();
        }
      });
      return observable;
  }

  public save(param: ResourceType<T>, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>> {
    this.setLoading();

    const observable = this.restService.save<ResourceType<T>>(param);

    observable.subscribe({
        next: (result: ResourceType<T>) => {
            result.version = getVersion();
            this.upsertCacheResource(result, this.cacheKey, (options && options.cache) ?? false);
          },
        error: (error: any) => { 
          console.error('[ERROR] BaseDataService.save -> %o', error);
          this.setError(error);
        },
        complete: () => { 
          this.setLoaded();
        }
      });
      return observable;
  }

  public add(param: ResourceType<T>, options?: Partial<IDataServiceOptions>): Observable<ResourceType<T>> {
    this.setLoading();

    const observable = this.restService.add<ResourceType<T>>(param);

    observable.subscribe({
        next: (result: ResourceType<T>) => {
            result.version = getVersion();
            this.upsertCacheResource(result, this.cacheKey, (options && options.cache) ?? false);
          },
        error: (error: any) => { 
          console.error('[ERROR] BaseDataService.add -> %o', error);
          this.setError(error);
        },
        complete: () => { 
          this.setLoaded();
        }
      });
      return observable;
  }

  public delete(id: number | bigint | string, options?: Partial<IDataServiceOptions>): Observable<any> {
    let replay = new ReplaySubject<number | bigint>(1);
    let observable = replay.asObservable();
    this.setLoading();
    this.restService
      .delete(id)
      .subscribe({
        next: (result: any) => {
            this.removeCacheResource(id, this.cacheKey);
            replay.next(result);
          },
        error: (error: any) => {
          console.error('[ERROR] BaseDataService.delete -> %o', error);
          this.setError(error); replay.error(error);
        },
        complete: () => {
          this.setLoaded();
          replay.complete();
        }
      });
      return observable;
  }
}
