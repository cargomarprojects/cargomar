import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TdsExemption, iTdsExemptionSearch, iTdsExemptionModel, initialState } from '../models/tdsexemption';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsExemptionService {

  private screen_id = '';
  public state: iTdsExemptionModel = { ...initialState };

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
      this.gs.appStates[this.screen_id] = this.state;
    }
  }
  

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: TdsExemption) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Taxm/TdsExemption', SearchData, this.gs.headerparam2('authorized'));
  }




}

