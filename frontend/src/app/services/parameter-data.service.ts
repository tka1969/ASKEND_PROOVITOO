import { Injectable } from '@angular/core';
import { ParameterService } from './parameter.service';
import { BaseDataService } from './basedata.service';
import { IParameter } from '../models/parameter';

@Injectable({
  providedIn: "root"
})
export class ParameterDataService extends BaseDataService<IParameter> {

  constructor(
    private parameterService: ParameterService
    ) {
    super(parameterService, 'parameter');
  }
}
