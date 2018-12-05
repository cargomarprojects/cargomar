
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobPackinglist } from '../models/jobpackinglist';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class JobPackingListService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobPackingList/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobPackingList/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: JobPackinglist) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobPackingList/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobPackingList/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobPackingList/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

