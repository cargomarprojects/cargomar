
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaxPlan } from '../models/taxplan';
import { TaxPland } from '../models/taxpland';
import { TaxPlanm } from '../models/taxplanm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TaxplanDetService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TaxplanDet/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TaxplanDet/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: TaxPlanm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TaxplanDet/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TaxplanDet/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

