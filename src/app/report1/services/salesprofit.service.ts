import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { iSalesProfitmModel, initialState } from '../models/salesprofit';

@Injectable()
export class SalesProfitService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  //Controller : Report1/ReportController
  //Service    : BLReport1/SalesProfitRptService

  private screen_id = '';
  public state: iSalesProfitmModel = { ...initialState };

  public init(_screen_id: string) {
    this.screen_id = _screen_id;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id]) {
      this.state = this.gs.appStates[this.screen_id];
    }
    else {
      this.state = { ...initialState };
      //default values
      this.state.year_code = this.gs.globalVariables.year_code;
      this.gs.appStates[this.screen_id] = this.state;
      this.LoadCombo();
      if (this.state.currentTab == 'LIST')
        this.List('NEW');
    }
  }

  // // Query List Data
  List(_type: string) {
    let SearchData = {
      type: _type,
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.user_company_code,
      year_code: this.state.year_code,
      page_count: this.state.page_count,
      page_current: this.state.page_current,
      page_rows: this.state.page_rows,
      page_rowcount: this.state.page_rowcount,
    };

    if (_type == "NEW")
      this.state.selectedRowIndex = 0;

    this.SalesProfitList(SearchData).subscribe(response => {
      this.state.RecordList = response.list;
      this.state.page_count = response.page_count;
      this.state.page_current = response.page_current;
      this.state.page_rowcount = response.page_rowcount;
    }, error => {
      this.state.RecordList = null;
      this.state.ErrorMessage = this.gs.getError(error);
    });
  }

  private LoadCombo() {
    let SearchData = {
      table: "YEARLIST",
      comp_code: this.gs.globalVariables.user_company_code
    };
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.state.YearList = response.list;
      }, error => {
        this.state.ErrorMessage = this.gs.getError(error);
      });
  }

  SalesProfitList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/SalesProfitList', SearchData, this.gs.headerparam2('authorized'));
  }

}

