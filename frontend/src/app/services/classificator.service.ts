import { Injectable } from '@angular/core';
import { IParameter } from '../models/parameter';

const classifCache: { [key: string]: IParameter[] } = {};
const classificatorCache = new Map<string, IParameter[]>();

@Injectable({
  providedIn: 'root'
})
export class ClassificatorService {

  public clean(): void {
    classificatorCache.clear();
  }

  public put(classificators: IParameter[]): void {
    classificators.forEach((classificator) => {
      var listClassificator: IParameter[] | undefined =  classificatorCache.get(classificator.parameterClass);

      if (listClassificator == undefined) {
        listClassificator = [];
      }
      listClassificator.push(classificator);
      classificatorCache.set(classificator.parameterClass, listClassificator);
    });
  }

  public get(classificator: string): IParameter[] {
    var listClassificator: IParameter[] | undefined = classificatorCache.get(classificator);

    if (listClassificator == undefined) {
        listClassificator = [];
    }
    return listClassificator;
  }

  public has(classificator: string): boolean {
    var listClassificator: IParameter[] | undefined = classificatorCache.get(classificator);

    return (!!listClassificator);
  }
}
