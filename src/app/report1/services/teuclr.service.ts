
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MonRep } from '../models/monrep';
import { Rebate } from '../models/rebate';
import { Rebatem } from '../models/rebate';
import { GlobalService } from '../../core/services/global.service';
import { Mappingm } from '../models/mapping';
import { iTeuClrModel, initialState } from '../models/teuclr';

@Injectable()
export class TeuClrService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iTeuClrModel = { ...initialState };


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
      this.state.shipper_name = '';
      this.state.consignee_name = '';
      this.state.agent_name = '';
      this.state.carrier_name = '';
      this.state.pol_name = '';
      this.state.pod_name = '';
      this.state.branch_code = this.gs.globalVariables.branch_code;
      this.state.branch_name = this.gs.globalVariables.branch_name;
      this.state.all = false;

      this.state.currentTab = 'LIST';
      this.gs.appStates[this.screen_id] = this.state;
    }
  }


  TeuClrList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/TeuClrList', SearchData, this.gs.headerparam2('authorized'));
  }

}

