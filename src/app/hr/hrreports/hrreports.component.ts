import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { HrReport } from '../models/hrreport';
import { HrReportService } from '../services/hrreport.service';

@Component({
  selector: 'app-hrreports',
  templateUrl: './hrreports.component.html',
  providers: [HrReportService]
})
export class HrReportsComponent {
  // Local Variables 
  title = 'HR Reports';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  bAdmin: boolean = false;
  bRemove: boolean = false;
  bChanged: boolean;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  modal: any;
  sub: any;
  urlid: string;

  salyear = 0;
  salmonth = 0;
  // fromdate: string = '';
  // todate: string = '';

  bapprovalstatus = "";
  reporttype = "EPF";
  empstatus = "BOTH";
  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';
  // Array For Displaying List
  RecordList: HrReport[] = [];

  // Single Record for add/edit/view details
  Record: HrReport = new HrReport;

  constructor(
    private modalService: NgbModal,
    private mainService: HrReportService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 30;
    this.page_current = 0;
    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {
    this.reporttype = 'EPF';
    this.empstatus = 'BOTH';
    this.bRemove = true;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_approval.length > 0)
        this.bapprovalstatus = this.menu_record.rights_approval.toString();
    }
    this.InitLov();
    if (this.gs.defaultValues.today.trim() != "") {
      var tempdt = this.gs.defaultValues.today.split('-');
      this.salyear = +tempdt[0];
      this.salmonth = +tempdt[1];
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }


  // Query List Data
  List(_type: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.salyear <= 0) {
      this.ErrorMessage += " | Invalid Year";
    } else if (this.salyear < 100) {
      this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
    }
    if (this.salmonth <= 0 || this.salmonth > 12) {
      this.ErrorMessage += " | Invalid Month";
    }
    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      salmonth: this.salmonth,
      salyear: this.salyear,
      reporttype: this.reporttype,
      empstatus: this.empstatus,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      branch_region: this.gs.defaultValues.pf_br_region,
      folderid: this.gs.getGuid(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else
          this.RecordList = response.list;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }




  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    // if (this.Record.job_date.trim().length <= 0) {
    //  bret = false;
    //  sError = " | Job Date Cannot Be Blank";
    // }

    //if (this.Record.sal_code.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | Code Cannot Be Blank";
    //}

    //if (this.Record.sal_desc.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | Description Cannot Be Blank";
    //}

    //if (this.Record.sal_head_order <= 0) {
    //  bret = false;
    //  sError += "\n\r | Invalid  order ";
    //}


    //if (bret === false)
    //  this.ErrorMessage = sError;

    return bret;
  }

  OnBlur(field: string) {
    // if (field == 'sal_pf_limit') {
    //   this.Record.sal_pf_limit = this.gs.roundNumber(this.Record.sal_pf_limit, 2);
    //   this.FindNetAmt();
    // }
    // if (field == 'sal_is_esi') {
    //   this.FindNetAmt();
    // }
    //if (field == 'sal_head') {
    //  this.Record.sal_head = this.Record.sal_head.toUpperCase();
    //}
  }
  OnChange(field: string) {
    this.RecordList = null;
  }

  Close() {
    this.gs.ClosePage('home');
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
}
