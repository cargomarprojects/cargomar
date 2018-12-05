
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobContainer } from '../models/jobcontainer';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class JobContainerService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobContainer/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobContainer/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: JobContainer) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobContainer/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobContainer/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobContainer/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

