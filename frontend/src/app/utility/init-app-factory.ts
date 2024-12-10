import { lastValueFrom } from 'rxjs';
import { IParameter } from '../models/parameter';
import { QueryModel, createQueryModel } from '../models/query.model';
import { ParameterDataService } from '../services/parameter-data.service';
import { ClassificatorService } from '../services/classificator.service';
import { AppConfigService } from '../services/app-config.service';


export function InitAppFactory(
    parameterService: ParameterDataService,
    classificatorService: ClassificatorService,
    appConfigService: AppConfigService
) {

  return async () => {
    console.log('InitAppFactory - started');

    classificatorService.clean();

    const queryp: QueryModel = createQueryModel(
      {
        parameters: {
          parameters: 'CRITERIA-TYPE,CRITERIA-AMOUNT,CRITERIA-TITLE,CRITERIA-DATE'
        }
      }
    );

    const queryParams$ = parameterService.list(queryp);
    return await lastValueFrom(queryParams$)
      .then((result: IParameter[]) => {
        classificatorService.put(result);
          console.log('InitParameterFactory - completed');
        }
      );
  };
}
