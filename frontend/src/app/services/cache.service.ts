import { Injectable } from '@angular/core';
import { CacheItem } from '../models/cache-item.model';
import { ResourceType } from '../types/resource.type';


@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private serviceCache: { [key: string]: CacheItem<any> } = {};

  constructor(
    ) {
  }

  put<T>(key: string, customCache?: { [key: string]: CacheItem<ResourceType<T>> }): CacheItem<ResourceType<T>> {
    const cache = (customCache || this.serviceCache);

    if (!!key && cache[key] != null) {
      return cache[key];
    }

    const casheItem: CacheItem<ResourceType<T>> = new CacheItem<ResourceType<T>>(key);

    cache[key] = casheItem;
    return casheItem;
  }

  get<T>(key?: string, customCache?: { [key: string]: CacheItem<ResourceType<T>> }): CacheItem<ResourceType<T>> | null {
    const cache = (customCache || this.serviceCache);

    if (!!key && cache[key] != null) {
      return cache[key];
    }
    return null;
  }

  remove<T>(key?: string, customCache?: { [key: string]: CacheItem<ResourceType<T>> }): void {
    const cache = (customCache || this.serviceCache);
    if (!!key && cache[key]) {
      delete this.serviceCache[key];
    }
  }

  clean<T>(customCache?: { [key: string]: CacheItem<ResourceType<T>> }): void {
    const cache = (customCache || this.serviceCache);
    this.serviceCache = {};
  }
}
