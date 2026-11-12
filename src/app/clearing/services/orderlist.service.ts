
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iJobordermModel, initialState, Joborderm } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';


@Injectable()
export class OrderListService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private screen_id = '';
  private screen_type = '';
  public state: iJobordermModel = { ...initialState };


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
      this.state.from_date = '';
      this.state.to_date = '';
      this.state.list_imp_code = '';
      this.state.list_imp_name = '';
      this.state.list_exp_code = '';
      this.state.list_exp_name = '';
      this.state.list_agent_code = '';
      this.state.list_agent_name = '';
      this.state.job_docno = '';
      this.state.ord_invoice = '';
      this.state.sort_colname = 'a.rec_created_date desc';
      this.state.ord_showpending = false;
      this.state.ord_status = 'ALL';
      this.state.ord_po = '';
      this.state.ftpTransfertype = 'ORDERLIST';
      // this.state.branch_name = this.gs.globalVariables.branch_name;

      this.state.currentTab = 'LIST';
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Joborderm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/Save', Record, this.gs.headerparam2('authorized'));
  }
  
  Upload(Record: JobOrder_VM) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/Upload', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateXmlEdiMexico(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlEdiMexico', SearchData, this.gs.headerparam2('authorized'));
  }
  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
  
  UpdateUid(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/UpdateUid', SearchData, this.gs.headerparam2('authorized'));
  }

}





