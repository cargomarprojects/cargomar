
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { Trackingm, Trackingh, iTrackingModel, initialState } from '../models/tracking';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TrackingService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iTrackingModel = { ...initialState };

  public init(_screen_id: string, _screen_type: string) {
    this.screen_id = _screen_id;
    this.screen_type = _screen_type;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      this.state.from_date = this.gs.defaultValues.lastmonthdate;
      this.state.to_date = this.gs.defaultValues.today;

      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Trackingm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/DeleteRecord', SearchData, this.gs.headerparam2('authorized'))
  }

  TransitTrackingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/TransitTrackingList', SearchData, this.gs.headerparam2('authorized'));
  }

  Savetrackh(Record: Trackingh) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/Savetrackh', Record, this.gs.headerparam2('authorized'));
  }
}

