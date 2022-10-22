
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emp } from '../models/emp';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EmpService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Emp) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DownloadEmpDocs(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/DownloadEmpDocs', SearchData, this.gs.headerparam2('authorized'));
  }
}

