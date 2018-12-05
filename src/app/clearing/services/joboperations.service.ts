
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobOperationsm } from '../models/joboperations';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class JobOperationsService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOperations/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOperations/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: JobOperationsm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOperations/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOperations/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOperations/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

