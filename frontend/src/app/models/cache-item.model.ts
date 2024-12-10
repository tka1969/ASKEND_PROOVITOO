import { ResourceType } from "../types/resource.type";

export class CacheItem<T> {
  private _flags: number;
  public key: string;
  public items: ResourceType<T>[] = [];
  public timeToLive: Date;

  constructor(key: string) {
    this._flags = 0;
    this.key = key;
    this.timeToLive = new Date();
  }

  public testFlag(flag: number | 0): boolean {
    return (this._flags & flag) != 0;
  }

  public setFlag(flag: number | 0): void {
    this._flags |= flag;
  }

  public clearFlag(flag: number | 0): void {
    this._flags &= (~flag);
  }

  public setResources(resources: ResourceType<T>[]): void {
    this.items = resources;
  }

  public upsertResource(resource: ResourceType<T>): void {
    const index = this.items.findIndex((item) => item.id === resource.id);
    if (index === -1) {
      this.items = [...this.items, resource];
    }
    else {
      this.items[index] = resource;
    }
  }

  public removeResource(id: number | bigint | string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
