
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EdiRecord } from '../models/edirecord';
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

  TransferData(Record: EdiRecord) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/TransferData', Record, this.gs.headerparam2('authorized'));
  }

  FileList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/xml/job/List', SearchData, this.gs.headerparam2('authorized'));
  }

  ImportData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/xml/job/ImportData', SearchData, this.gs.headerparam2('authorized'));
  }

  ProcessDocuments(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/xml/job/ProcessDocuments', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/xml/job/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  InwardEdiEmailDownload(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Email/InwardEdiEmailDownload', SearchData, this.gs.headerparam2('authorized'));
  }

  SignFiles(Record: EdiRecord) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/SignFiles', Record, this.gs.headerparam2('authorized'));
  }

  ProcessSb(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Common/EdiSb/ProcessSb', SearchData, this.gs.headerparam2('authorized'));
  }
   
}

