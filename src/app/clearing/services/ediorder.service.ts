
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { iEdiOrderModel, initialState } from '../models/ediorder';

@Injectable()
export class EdiOrderService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iEdiOrderModel = { ...initialState };

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
      this.state.selectcheck = false;
      this.state.agent_id = 'B8C93DB0-5127-E16A-23C0-BF42E6E06005';
      this.state.update_type = 'ALL';
      this.state.chk_all_pol = false;
      this.state.searchstring = '';
      this.state.ord_po_aprvd = '';
      // this.state.branch_name = this.gs.globalVariables.branch_name;

      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/List', SearchData, this.gs.headerparam2('authorized'));
  }
  Process(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/Process', SearchData, this.gs.headerparam2('authorized'));
  }
  UpdateOrdersList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/UpdateOrdersList', SearchData, this.gs.headerparam2('authorized'));
  }
}

