import { Injectable } from '@angular/core';
import { IParameter } from '../models/parameter';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class ParameterService extends BaseService<IParameter> {

  constructor(
    ) {
    super('parameter');
  }
}
