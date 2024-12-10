import { Injectable } from '@angular/core';
import { IFilterCriteria } from '../models/filter-criteria';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FilterCriteriaService extends BaseService<IFilterCriteria> {

  constructor(
    ) {
    super('filter-criteria');
  }
}
