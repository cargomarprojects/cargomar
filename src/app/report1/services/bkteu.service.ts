
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BkTeu, iBkTeuModel, initialState } from '../models/bkteu';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BkTeuService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iBkTeuModel = { ...initialState };


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
      this.state.type_date = "SOB";
      this.state.from_date = this.gs.defaultValues.monthbegindate;
      this.state.to_date = this.gs.defaultValues.today;
      this.state.shipper_name = '';
      this.state.consignee_name = '';
      this.state.agent_name = '';
      this.state.carrier_name = '';
      this.state.pol_name = '';
      this.state.pod_name = '';
      this.state.branch_code = this.gs.globalVariables.branch_code;
      this.state.branch_name = this.gs.globalVariables.branch_name;

      this.state.currentTab = 'LIST';
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/BkTeu/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + 'api/Report1/BkTeu/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

