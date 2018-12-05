
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EsanchitLinkService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Email/Esanchit/LinkList', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Email/Esanchit/SaveLink', SearchData, this.gs.headerparam2('authorized'));
  }
}

