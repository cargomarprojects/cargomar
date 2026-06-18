import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LlmDoc, iLlmDocModel, initialState } from '../models/llmdoc';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LlmDocService {

  private screen_id = '';
  public state: iLlmDocModel = { ...initialState };

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
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LlmDoc/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LlmDoc/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: LlmDoc) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LlmDoc/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LlmDoc/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }


}
