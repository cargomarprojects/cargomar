
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AddReportsService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AddReports/List', SearchData, this.gs.headerparam2('authorized'));
  }

  SalesReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AddReports/SalesReport', SearchData, this.gs.headerparam2('authorized'));
  }
  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + 'api/Report1/AddReports/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  CustomerDetails(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AddReports/CustomerDetails', SearchData, this.gs.headerparam2('authorized'));
  }

  LockedSmanReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AddReports/LockedSmanReport', SearchData, this.gs.headerparam2('authorized'));
  }

  PendingDocReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AddReports/PendingDocReport', SearchData, this.gs.headerparam2('authorized'));
  }

}

