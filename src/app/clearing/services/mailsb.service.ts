
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MailSB } from '../models/mailsb';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MailSbService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Email/Checksb/List', SearchData, this.gs.headerparam2('authorized'));
  }

  SaveSettings(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Email/Checksb/SaveSettings', SearchData, this.gs.headerparam2('authorized'));
  }
}

