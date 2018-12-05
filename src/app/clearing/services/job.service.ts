
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jobm } from '../models/job';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class JobService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Jobm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/Save', Record, this.gs.headerparam2('authorized'));
  }

  GenerateEdi(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GenerateEdi', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateEdiNo(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GenerateEdiNo', SearchData, this.gs.headerparam2('authorized'));
  }


  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  GetCustomerDetails(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GetCustomerDetails', SearchData, this.gs.headerparam2('authorized'));
  }

  GetCreditLimit(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GetCreditLimit', SearchData, this.gs.headerparam2('authorized'));
  }

  SignDoc(SearchData: any) {

    return this.http2.post<any>(this.gs.baseLocalServerUrl + '/api/Email/SignDoc', SearchData, this.gs.headerparam2('anonymous'));
  }

  GetMailDetails(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GetMailDetails', SearchData, this.gs.headerparam2('authorized'));

  }

}

