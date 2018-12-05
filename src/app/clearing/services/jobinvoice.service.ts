
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobInvoicem } from '../models/jobinvoice';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class JobInvoiceService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobInvoice/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobInvoice/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: JobInvoicem) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobInvoice/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobInvoice/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobInvoice/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

