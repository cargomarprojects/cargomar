
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class OnlineTrackMasterService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OnlineTrackMaster/List', SearchData, this.gs.headerparam2('authorized'));
  }
  TrackingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OnlineTrackMaster/TrackingList', SearchData, this.gs.headerparam2('authorized'));
  }
}





