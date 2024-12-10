import { Observable } from "rxjs";
import { ServiceResultCode } from "../services/basedata.service";


export interface ICommonServiceTask {
    doServiceTask(serviceName: string, observer: Observable<any>, parameterData?: any): void;
    onServiceComplete(serviceName: string, resultCode: ServiceResultCode, result: any, parameterData?: any): void;
}

export class CommonServiceTask implements ICommonServiceTask {
    
    constructor(
        ) {
      }

    public doServiceTask(serviceName: string, observer: Observable<any>, parameterData?: any): void {
        observer.subscribe({
            next: (result: any) => {
                this.onServiceComplete(serviceName, ServiceResultCode.COMPLETED, result, parameterData);
            },
            error: (error: any) => { 
              console.error('[ERROR] CommonServiceTask.doServiceTask.[ERROR] => %o', error);
              this.onServiceComplete(serviceName, ServiceResultCode.ERROR, error, parameterData);
            },
            complete: () => { 
            }
        });
    }
        
    public onServiceComplete(serviceName: string, resultCode: ServiceResultCode, result: any, parameterData?: any): void {
    }
}
