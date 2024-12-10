import { Injectable } from '@angular/core';
import { IFilterCriteria } from '../models/filter-criteria';
import { BaseDataService } from './basedata.service';
import { FilterCriteriaService } from './filter-criteria.service';


@Injectable({
  providedIn: "root"
})
export class FilterCriteriaDataService extends BaseDataService<IFilterCriteria> {

  constructor(
    private filterCriteriaService: FilterCriteriaService
    ) {
    super(filterCriteriaService, 'filter-criteria');
  }
}
