import { Injectable } from '@angular/core';
import { IFilter } from '../models/filter';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class FilterService extends BaseService<IFilter> {

  constructor(
    ) {
    super('filter');
  }
}
