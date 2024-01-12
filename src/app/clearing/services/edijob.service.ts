
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Jobm } from '../models/job';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EdijobService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/List', SearchData, this.gs.headerparam2('authorized'));
  }

  FindMissingData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/FindMissingData', SearchData, this.gs.headerparam2('authorized'));
  }

  TransferData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/TransferData', SearchData, this.gs.headerparam2('authorized'));
  }

  FileList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/xml/InwardEdiFiles/List', SearchData, this.gs.headerparam2('authorized'));
  }

  ImportData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/xml/job/ImportData', SearchData, this.gs.headerparam2('authorized'));
  }

  InwardEdiEmailDownload(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Email/InwardEdiEmailDownload', SearchData, this.gs.headerparam2('authorized'));
  }
}

