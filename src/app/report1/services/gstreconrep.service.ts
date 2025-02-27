
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Gstr2bDownload, iGstr2bDownloadModel, initialState } from '../models/gstr2bdownload';

@Injectable()
export class GstReconRepService {

  private screen_id = '';
  public state: iGstr2bDownloadModel = { ...initialState };

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
      this.initDefault();
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  private initDefault() {
    this.state.gst_recon_year = this.gs.defaultValues.gst_recon_year;
    this.state.gst_recon_month = this.gs.defaultValues.gst_recon_month;
    this.state.gst_recon_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_state_name = this.gs.globalVariables.branch_gstin_state_name;
    this.state.gst_recon_itc_year = this.gs.defaultValues.gst_recon_itc_year;
    this.state.gst_recon_itc_month = this.gs.defaultValues.gst_recon_itc_month;
    this.state.gst_recon_itc_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_itc_state_name = this.gs.globalVariables.branch_gstin_state_name;
    this.state.gst_recon_itc_list_year = this.gs.defaultValues.gst_recon_itc_list_year;
    this.state.gst_recon_itc_list_month = this.gs.defaultValues.gst_recon_itc_list_month;
    this.state.gst_recon_itc_list_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_itc_list_state_name = this.gs.globalVariables.branch_gstin_state_name;
    this.state.gst_recon_cdnr_year = this.gs.defaultValues.gst_recon_cdnr_year;
    this.state.gst_recon_cdnr_month = this.gs.defaultValues.gst_recon_cdnr_month;
    this.state.gst_recon_cdnr_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_cdnr_state_name = this.gs.globalVariables.branch_gstin_state_name;
    this.state.gst_recon_rc_year = this.gs.defaultValues.gst_recon_rc_year;
    this.state.gst_recon_rc_month = this.gs.defaultValues.gst_recon_rc_month;
    this.state.gst_recon_rc_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_rc_state_name = this.gs.globalVariables.branch_gstin_state_name;
    this.state.gst_recon_ament_year = this.gs.defaultValues.gst_recon_ament_year;
    this.state.gst_recon_ament_month = this.gs.defaultValues.gst_recon_ament_month;
    this.state.gst_recon_ament_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_ament_state_name = this.gs.globalVariables.branch_gstin_state_name;
    this.state.gst_recon_gensearch_state_code = this.gs.globalVariables.branch_gstin_state_code;
    this.state.gst_recon_gensearch_state_name = this.gs.globalVariables.branch_gstin_state_name;
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

  AmendmentList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/AmendmentList', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  Gstr2aReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/Gstr2aReport', SearchData, this.gs.headerparam2('authorized'));
  }

  GetPurchaseInvoice(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/GetPurchaseInvoice', SearchData, this.gs.headerparam2('authorized'));
  }

  SavePurchaseInvoice(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/SavePurchaseInvoice', SearchData, this.gs.headerparam2('authorized'));
  }

  SaveGstAmt(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/SaveGstAmt', SearchData, this.gs.headerparam2('authorized'));
  }

  ProcessGSTRApi(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/ProcessGSTRApi', SearchData, this.gs.headerparam2('authorized'));
  }

  GstGenSearchList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GstReconRep/GstGenSearchList', SearchData, this.gs.headerparam2('authorized'));
  }

}

