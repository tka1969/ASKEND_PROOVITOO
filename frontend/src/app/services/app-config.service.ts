import { Injectable } from '@angular/core';
import { IParameter } from '../models/parameter';


export interface IAppConfig  {
  lifeCycleId: string;
  language: IParameter;
}

export const appConfig: IAppConfig = {
  lifeCycleId: '01J3ZQAP87KZ0Q0KWNGSSTM31W',
  language: {
    id: BigInt(0),
    parameterClass: 'APP-LANGUAGE',
    property: 'EST',
    name: 'Eesti keel',
    }
  } as IAppConfig;


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(
  ) {
  }
  
  putLanguage(language: IParameter): void {
    appConfig.language = language;
  }

  getConfig(): IAppConfig {
    return appConfig;
  }
}
