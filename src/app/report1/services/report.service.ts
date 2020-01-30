
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MonRep } from '../models/monrep';
import { Rebate } from '../models/rebate';
import { Rebatem } from '../models/rebate';
import { GlobalService } from '../../core/services/global.service';
import { Mappingm } from '../models/mapping';

@Injectable()
export class RepService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/MonRepList', SearchData, this.gs.headerparam2('authorized'));
  }

  GetCostOs(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/GetCostOs', SearchData, this.gs.headerparam2('authorized'));
  }

  PrintList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/PrintList', SearchData, this.gs.headerparam2('authorized'));
  }
  PendingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/PendingList', SearchData, this.gs.headerparam2('authorized'));
  }
  DsrList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/DsrList', SearchData, this.gs.headerparam2('authorized'));
  }


  OsReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/OsList', SearchData, this.gs.headerparam2('authorized'));
  }

  GstReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/GstList', SearchData, this.gs.headerparam2('authorized'));
  }


  RebateReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/RebateList', SearchData, this.gs.headerparam2('authorized'));
  }


  SaveRebate(Record: Rebatem) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/SaveRebate', Record, this.gs.headerparam2('authorized'));
  }

  EgmList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/EgmList', SearchData, this.gs.headerparam2('authorized'));
  }

  BrokList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/BrokList', SearchData, this.gs.headerparam2('authorized'));
  }

  AirListReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/AirPaymentList', SearchData, this.gs.headerparam2('authorized'));
  }

  InvListReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/AirInvList', SearchData, this.gs.headerparam2('authorized'));
  }

  TeuClrList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/TeuClrList', SearchData, this.gs.headerparam2('authorized'));
  }

  CostStmtList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/CostStmtList', SearchData, this.gs.headerparam2('authorized'));
  }

  TrackList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/TrackList', SearchData, this.gs.headerparam2('anonymous'));
  }

  UpdateDsrRemarks(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/UpdateDsrRemarks', SearchData, this.gs.headerparam2('authorized'));

  }
  MappingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/MappingList', SearchData, this.gs.headerparam2('authorized'));

  }

  SaveMapping(Record: Mappingm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/SaveMapping', Record, this.gs.headerparam2('authorized'));
  }

  TdspaidReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/TdsPaidList', SearchData, this.gs.headerparam2('authorized'));
  }

  TdsosReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/TdsosReport', SearchData, this.gs.headerparam2('authorized'));
  }
  AuditLog(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/AuditLog', SearchData, this.gs.headerparam2('authorized'));
  }
  UpdateMonReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/UpdateMonReport', SearchData, this.gs.headerparam2('authorized'));
  }
  
  GenerateXmlCostingInvoice(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlCostingInvoice', SearchData, this.gs.headerparam2('authorized'));
  }
}

