import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Auditlog } from '../models/auditlog';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  providers: [RepService]
})
export class AuditLogComponent {
  // Local Variables 
  title = 'Audit Details';

  @Input() public type: string = '';
  @Input() menuid: string = '';

  menu_record: any;
  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;

  pkid: string;
  searchstring: string = '';
  searchuser: string = '';
  searchtype: string = '';
  searchmodule: string = '';
  searchbranch: string = '';
  searchaction: string = '';
  searchremarks: string = '';
  from_date: string = '';
  to_date: string = '';
  page_count: number = 0;
  page_current: number = 0;
  page_rowcount: number = 0;
  page_rows: number = 0;
  TypeList: any[] = [];

  ErrorMessage = "";
  InfoMessage = "";
  RecordList: Auditlog[] = [];

  constructor(
    private mainService: RepService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 50;
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

  }

  InitComponent() {
    this.to_date = this.gs.defaultValues.today;
    this.from_date = this.gs.defaultValues.today;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
    this.InitLov();
    this.LoadCombo();
  }

  InitLov() {
  }
  LovSelected(_Record: SearchTable) {
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //  <option value="AGENT INVOICE"></option>
  // <option value="AIR EXPORT"></option>
  // <option value="AIR EXPORT COSTING"></option>
  // <option value="AIR+EXPORT"></option>
  // <option value="AMTUPDATE"></option>
  // <option value="ANOOP-SHIPMENT-DATA-MARKETING"></option>
  // <option value="ARRIVAL NOTICE"></option>
  // <option value="BL-SURRENDER-MAIL-HO"></option>
  // <option value="BL-UPDATE"></option>
  // <option value="BOOKING TEU"></option>
  // <option value="BP"></option>
  // <option value="BP-APPROVAL"></option>
  // <option value="BR"></option>
  // <option value="BRANCH-LOGIN"></option>
  // <option value="CI"></option>
  // <option value="CN"></option>
  // <option value="CP"></option>
  // <option value="CR"></option>
  // <option value="DESPATCH-DETAILS"></option>
  // <option value="DI"></option>
  // <option value="DN"></option>
  // <option value="DRCR ISSUE"></option>
  // <option value="FUND-TRANSFER"></option>
  // <option value="GENERATE"></option>
  // <option value="GENERATE-FOLDER"></option>
  // <option value="HBL"></option>
  // <option value="HBL-AE"></option>
  // <option value="HBL-AI"></option>
  // <option value="HBL-SE"></option>
  // <option value="HBL-SI"></option>
  // <option value="HO"></option>
  // <option value="HR-BONUS"></option>
  // <option value="HR-EMPLOYEE-MASTER"></option>
  // <option value="HR-LEAVE-DETAILS"></option>
  // <option value="HR-LEAVE-MASTER"></option>
  // <option value="HR-PAYROLL"></option>
  // <option value="HR-PAYSLIP-MAIL"></option>
  // <option value="HR-RE-JVPOST"></option>
  // <option value="HR-SALARY-MASTER"></option>
  // <option value="IN"></option>
  // <option value="IN-ES"></option>
  // <option value="INVOICE"></option>
  // <option value="ISF"></option>
  // <option value="JOB"></option>
  // <option value="JOB SEA EXPORT"></option>
  // <option value="JOB UNLOCK CREDIT LIMIT"></option>
  // <option value="JOB-AE"></option>
  // <option value="JOB-GN"></option>
  // <option value="JOB-SE"></option>
  // <option value="JV"></option>
  // <option value="JV-BP"></option>
  // <option value="LOCK-ALL"></option>
  // <option value="MAIL"></option>
  // <option value="MBL"></option>
  // <option value="MBL-AE"></option>
  // <option value="MBL-AI"></option>
  // <option value="MBL-SE"></option>
  // <option value="MBL-SE-ACTIONFXT-GB"></option>
  // <option value="MBL-SE-INFINITRAN-US"></option>
  // <option value="MBL-SE-MOTHERLINES-US"></option>
  // <option value="MBL-SE-RITRACARGO-NL"></option>
  // <option value="MBL-SE-TRANSPORTE-MX"></option>
  // <option value="MBL-SI"></option>
  // <option value="MIS-WEEKLY-SALES-REPORT"></option>
  // <option value="MIS-WEEKLY-VOLUME-REPORT"></option>
  // <option value="OB"></option>
  // <option value="OC"></option>
  // <option value="OI"></option>
  // <option value="OP"></option>
  // <option value="ORDERLIST"></option>
  // <option value="OS-ALL"></option>
  // <option value="OS-DELHI"></option>
  // <option value="OS-HISTORY"></option>
  // <option value="OS-INVOICE"></option>
  // <option value="OS-SALESMAN-ALL"></option>
  // <option value="PAYSLIP-ALL"></option>
  // <option value="PENDING"></option>
  // <option value="PLANNING"></option>
  // <option value="PN"></option>
  // <option value="PN-CI"></option>
  // <option value="PN-JV"></option>
  // <option value="RB"></option>
  // <option value="REFNO"></option>
  // <option value="SALES-LEAD"></option>
  // <option value="SALESFOLLOWUP"></option>
  // <option value="SAVE"></option>
  // <option value="SE CONSOLE COSTING"></option>
  // <option value="SEA EXPORT"></option>
  // <option value="SEA EXPORT COSTING"></option>
  // <option value="SEA+EXPORT"></option>
  // <option value="SHIPMENT-DATA-MARKETING"></option>
  // <option value="STUFFING-LOADING-DETAILS"></option>
  // <option value="TRACKING"></option>
  // <option value="TRKUPDATE"></option>
  // <option value="UPDATE"></option>
  // <option value="USER-LOGOUT"></option>
  // <option value="VISIT-REPORT"></option> 
  LoadCombo() {
    this.TypeList = [{ "name": "BP" }, { "name": "BR" }, { "name": "CI" },
    { "name": "CN" }, { "name": "CP" }, { "name": "CR" },
    { "name": "DI" }, { "name": "DN" }, { "name": "IN" },
    { "name": "IN-ES" }, { "name": "JV" }, { "name": "JV-BP" },
    { "name": "OB" }, { "name": "OC" }, { "name": "OC" },
    { "name": "OI" }, { "name": "OP" }, { "name": "PN" },
    { "name": "PN-CI" }, { "name": "PN-JV" }, { "name": "RB" }
    ];
  }
  
  // Save Data
  OnBlur(field: string) {
    if (field == 'searchuser') {
      this.searchuser = this.searchuser.toUpperCase();
    }
    if (field == 'searchtype') {
      this.searchtype = this.searchtype.toUpperCase();
    }
    if (field == 'searchmodule') {
      this.searchmodule = this.searchmodule.toUpperCase();
    }
    if (field == 'searchbranch') {
      this.searchbranch = this.searchbranch.toUpperCase();
    }
    if (field == 'searchaction') {
      this.searchaction = this.searchaction.toUpperCase();
    }
    if (field == 'searchremarks') {
      this.searchremarks = this.searchremarks.toUpperCase();
    }
  }
  Close() {
    this.gs.ClosePage('home');
  }

  List(_type: string) {
    this.InfoMessage = "";
    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    this.pkid = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      type: _type,
      rowtype: this.type,
      report_folder: this.gs.globalVariables.report_folder,
      searchstring: this.searchstring.toUpperCase(),
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_pkid: this.gs.globalVariables.user_pkid,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.from_date,
      to_date: this.to_date,
      searchuser: this.searchuser,
      searchtype: this.searchtype,
      searchmodule: this.searchmodule,
      searchbranch: this.searchbranch,
      searchaction: this.searchaction,
      searchremarks: this.searchremarks
    };

    this.ErrorMessage = '';
    this.mainService.AuditLog(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  openWebSite(_type: string, _webid: string) {
    if (_type == "USER-LOGIN" || _type == "BRANCH-LOGIN") {
      if (_webid.indexOf('-') >= 0) {
        var temparr = _webid.split('-');
        _webid = temparr[0];
      }
      window.open("https://www.whtop.com/tools.ip/" + _webid, "_blank");
    }
  }


  SearchRecord(_type: string) {
    this.InfoMessage = "";
    this.ErrorMessage = "";

    let SearchData = {
      table: '',
      type: '',
      pkid: '',
      company_code: '',
      branch_code: '',
      audit_date: ''
    };

    if (_type == "AUDITLOG") {
      if (this.from_date == '') {
        this.ErrorMessage = "From Date Cannot be Empty."
        alert(this.ErrorMessage);
        return;
      }
      SearchData.table = 'updategeneral';
      SearchData.type = _type;
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.audit_date = this.from_date;
    }

    this.loading = true;
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0)
          this.ErrorMessage = response.serror;
        else
          this.InfoMessage = 'Save Complete';
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
