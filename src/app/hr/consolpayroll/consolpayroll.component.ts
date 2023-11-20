import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Salarym } from '../models/salarym';
import { SalDet } from '../models/salarym';
import { SearchTable } from '../../shared/models/searchtable';
import { ConsolPayrollService } from '../services/consolpayroll.service';


@Component({
  selector: 'app-consolpayroll',
  templateUrl: './consolpayroll.component.html',
  providers: [ConsolPayrollService]
})
export class ConsolPayrollComponent {
  // Local Variables 
  title = 'Consol Payroll';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  bPrint: boolean = false;
  bAdmin: boolean = false;
  bRemove: boolean = false;
  bChanged: boolean;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  selectedRowIndex = 0;
  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  modal: any;
  sub: any;
  urlid: string;

  branch_code: string;
  bCompany = false;
  salyear = 0;
  salmonth = 0;
  bSalarySheet = false;
  bBranchSummary = false;

  fromdate: string = '';
  todate: string = '';

  reporttype = "FORMAT1";
  empstatus = "BOTH";
  ErrorMessage = "";
  InfoMessage = "";
  empregion = "ALL";
  prtype = "PAY ROLL";

  mode = '';
  pkid = '';
  BRRECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Salarym[] = [];

  // Single Record for add/edit/view details
  Record: Salarym = new Salarym;
  Recorddet: SalDet = new SalDet;

  constructor(
    private modalService: NgbModal,
    private mainService: ConsolPayrollService,
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
    this.fromdate = this.gs.defaultValues.today;
    this.todate = this.gs.defaultValues.today;
    this.branch_code = this.gs.globalVariables.branch_code;
    this.reporttype = 'FORMAT1';
    this.empstatus = 'BOTH';
    this.empregion = 'ALL';
    this.prtype = 'PAY ROLL'
    this.bRemove = true;
    this.bPrint = false;
    this.bAdmin = false;
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
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
    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
    }
  }
  // Query List Data
  List(_type: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.prtype === 'PAY ROLL') {
      if (this.salyear <= 0) {
        this.ErrorMessage += " | Invalid Year";
      } else if (this.salyear < 100) {
        this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
      }
      if (this.salmonth <= 0 || this.salmonth > 12) {
        this.ErrorMessage += " | Invalid Month";
      }
    }

    if (this.bSalarySheet && this.bBranchSummary) {
      this.ErrorMessage += " | Please select either Salary Sheet or Branch Summary and Continue.....";
    }

    if (this.bSalarySheet && this.prtype != 'PAY ROLL') {
      this.ErrorMessage += " | To print Salary Sheet Please select type as Monthwise and Continue.....";
    }

    if (this.bBranchSummary && this.prtype != 'PAY ROLL') {
      this.ErrorMessage += " | To print Branch Summary Please select type as Monthwise and Continue.....";
    }

    if (this.ErrorMessage.length > 0)
      return;

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      salmonth: this.salmonth,
      salyear: this.salyear,
      reporttype: this.reporttype,
      empstatus: this.empstatus,
      empregion: this.empregion,
      prtype: this.prtype,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      branch_region: this.gs.defaultValues.pf_br_region,
      folderid: this.gs.getGuid(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      bsalarysheet: this.bSalarySheet,
      bbranchsummary: this.bBranchSummary,
      fromdate: this.fromdate,
      todate: this.todate
    };

    if (this.bCompany) {
      SearchData.branch_code = this.branch_code;
    }

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.Recorddet = response.record;
          this.RecordList = response.list;
        }

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
    this.bSalarySheet=false;
    this.bBranchSummary=false;
    this.RecordList = null;
  }

  Close() {
    this.gs.ClosePage('home');
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
}
