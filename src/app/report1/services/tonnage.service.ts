
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { iTonnageModel, initialState, Tonnage } from '../models/tonnage';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TonnageService {

  private screen_id = '';
  public state: iTonnageModel = { ...initialState };

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  public init(_screen_id: string) {
    this.screen_id = _screen_id;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      this.state.from_date = this.gs.getNewdate(180);
      this.state.to_date = this.gs.defaultValues.today;
      this.state.branch_code = this.gs.globalVariables.branch_code;
      this.state.year_code = this.gs.globalVariables.year_code;
      this.state.currentTab = 'LIST';
      this.state.list_format = 'GENERAL';
      this.state.type_date = 'MAWB DATE';
      this.state.report_format = 'GENERAL';
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/Tonnage/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/Tonnage/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

