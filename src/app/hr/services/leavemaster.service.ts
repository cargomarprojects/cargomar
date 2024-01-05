
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leavem } from '../models/leavem';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LeaveMasterService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveMaster/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveMaster/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Leavem) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveMaster/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveMaster/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  Generate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveMaster/Generate', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveMaster/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

