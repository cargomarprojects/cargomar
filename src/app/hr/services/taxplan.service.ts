
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaxPlan } from '../models/taxplan';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TaxplanService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Taxplan/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Taxplan/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: TaxPlan) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Taxplan/Save', Record, this.gs.headerparam2('authorized'));
  }

}

