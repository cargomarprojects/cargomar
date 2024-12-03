
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Gstr2bDownload } from '../models/gstr2bdownload';

@Injectable()
export class GstReconRepService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  public appid: string = "";
  RecordListReco: Gstr2bDownload[] = [];
  RecordListItc: Gstr2bDownload[] = [];

  InitList() {
    if (this.appid != this.gs.appid) {
      this.appid = this.gs.appid;
      this.RecordListReco = null;
      this.RecordListItc = null;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/List', SearchData, this.gs.headerparam2('authorized'));
  }

  DetailList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/DetailList', SearchData, this.gs.headerparam2('authorized'));
  }


  ItcList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/ItcList', SearchData, this.gs.headerparam2('authorized'));
  }

  ProcessGstReconcile(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/ProcessGstReconcile', SearchData, this.gs.headerparam2('authorized'));
  }

  UpdateItcClaim(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/UpdateItcClaim', SearchData, this.gs.headerparam2('authorized'));
  }

  UpdatePurchaseData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/UpdatePurchaseData', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

