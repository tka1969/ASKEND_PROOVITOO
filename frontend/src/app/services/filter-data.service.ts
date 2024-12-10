import { Injectable } from '@angular/core';
import { IFilter } from '../models/filter';
import { BaseDataService } from './basedata.service';
import { FilterService } from './filter.service';


@Injectable({
  providedIn: "root"
})
export class FilterDataService extends BaseDataService<IFilter> {

  constructor(
    private filterService: FilterService
    ) {
    super(filterService, 'filter');
  }
}
