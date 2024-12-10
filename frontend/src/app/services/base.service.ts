import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { QueryModel } from '../models/query.model';
import { ResourceType } from '../types/resource.type';


export class BaseService<T> {
  
  httpclient = inject(HttpClient);

  constructor(private _service: String) {}

  public get service() {
    return this._service ?? "";
  };

  protected getServiceV1Url(): string {
    return environment.apiUrl + environment.apiV1 + this.service + '/';
  }

  protected getRootServiceV1Url(): string {
    return environment.apiUrl + environment.apiV1;
  }

  list<T>(inquery: QueryModel, path?: string): Observable<ResourceType<T>[]> {
    const dataSubject: ReplaySubject<ResourceType<T>[]> = new ReplaySubject<ResourceType<T>[]>(1);
    const url = path ? path + 'list' : this.service + '/list';
    const params = inquery.parameters ? { params: new HttpParams().appendAll(inquery.parameters) } : {};

     const observable = this.httpclient.get<ResourceType<T>[]>(this.getRootServiceV1Url() + url, params);

    observable.subscribe({
        next: (result: ResourceType<T>[]) => {
          dataSubject.next(result);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseService.list -> %o', error);
          dataSubject.error(error);
        },
        complete: () => { 
          dataSubject.complete();
        }
      });
      return dataSubject.asObservable();
  }

  get<T>(id?: number | bigint | string, path?: string): Observable<ResourceType<T>> {
    const dataSubject: ReplaySubject<ResourceType<T>> = new ReplaySubject<ResourceType<T>>(1);
    const url = path ? path : this.service + '/';
    
    const observable = (id)
                      ? this.httpclient.get<ResourceType<T>>(this.getRootServiceV1Url() + url + id)
                      : this.httpclient.get<ResourceType<T>>(this.getRootServiceV1Url() + url)
                        ;
                        
    observable.subscribe({
        next: (result: ResourceType<T>) => {
          dataSubject.next(result);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseService.query -> %o', error);
          dataSubject.error(error);
        },
        complete: () => { 
          dataSubject.complete();
        }
      });
      return dataSubject.asObservable();
  }

  save<T>(param: ResourceType<T>, path?: string): Observable<ResourceType<T>> {
    const dataSubject: ReplaySubject<ResourceType<T>> = new ReplaySubject<ResourceType<T>>(1);
    const url = path ? path : this.service;

    const observable = this.httpclient.put<ResourceType<T>>(this.getRootServiceV1Url() + url, param);

    observable.subscribe({
        next: (result: ResourceType<T>) => {
          dataSubject.next(result);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseService.query -> %o', error);
          dataSubject.error(error);
        },
        complete: () => { 
          dataSubject.complete();
        }
      });
      return dataSubject.asObservable();
  }

  add<T>(param: ResourceType<T>, path?: string): Observable<ResourceType<T>> {
    const dataSubject: ReplaySubject<ResourceType<T>> = new ReplaySubject<ResourceType<T>>(1);
    const url = path ? path + 'add' : this.service + '/add';
    const observable = this.httpclient.post<ResourceType<T>>(this.getRootServiceV1Url() + url, param);

    observable.subscribe({
        next: (result: ResourceType<T>) => {
          dataSubject.next(result);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseService.query -> %o', error);
          dataSubject.error(error);
        },
        complete: () => { 
          dataSubject.complete();
        }
      });
      return dataSubject.asObservable();
  }

  delete(id: number | bigint | string, path?: string): Observable<any> {
    const dataSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
    const url = path ? path  : this.service + '/';
    const observable = this.httpclient.delete<any>(this.getRootServiceV1Url() + url + id);

    observable.subscribe({
        next: (result: any) => {
          dataSubject.next(result);
        },
        error: (error: any) => { 
          console.error('[ERROR] BaseService.delete -> %o', error);
          dataSubject.error(error);
        },
        complete: () => { 
          dataSubject.complete();
        }
      });
      return dataSubject.asObservable();
  }

}
