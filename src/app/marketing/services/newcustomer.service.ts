
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iNewCustReportModel, initialState, NewCustReport } from '../models/newcustrpt';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class NewCustomerService {

  private screen_id = '';
  private screen_type = '';
  public state: iNewCustReportModel = { ...initialState };

  constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

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
        this.state.Initialized = false;
 
        this.state.fromdate = '';
        this.state.searchType = 'ALL';
        this.state.searchstring = '';
        this.state.Is_Nomination = false;

        this.gs.appStates[this.screen_id] = this.state;
      }
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/NewCustomer/List', SearchData, this.gs.headerparam2('authorized'));
    }
 
    LoadDefault(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/NewCustomer/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

}

