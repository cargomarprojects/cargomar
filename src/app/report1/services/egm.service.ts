
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MonRep } from '../models/monrep';
import { Rebate } from '../models/rebate';
import { Rebatem } from '../models/rebate';
import { GlobalService } from '../../core/services/global.service';
import { Mappingm } from '../models/mapping';
import { iEgmModel, initialState } from '../models/egm';

@Injectable()
export class EgmService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iEgmModel = { ...initialState };


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
      this.state.searchstring = '';

      this.state.currentTab = 'LIST';
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  EgmList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/EgmList', SearchData, this.gs.headerparam2('authorized'));
  }

}

