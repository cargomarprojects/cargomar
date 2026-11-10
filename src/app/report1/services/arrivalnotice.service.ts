
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BkTeu } from '../models/bkteu';
import { GlobalService } from '../../core/services/global.service';
import { iArrivalNoticeModel, initialState } from '../models/arrivalnotice';

@Injectable()
export class ArrivalNoticeService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iArrivalNoticeModel = { ...initialState };
  
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

      this.state.shipper_name = '';
      this.state.priordays = 10;
      
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ArrivalNotice/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + 'api/Report1/ArrivalNotice/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

