import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Auditlog } from '../../report1/models/auditlog';
import { AttendanceRegService } from '../services/attendancereg.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-attendancereg',
  templateUrl: './attendancereg.component.html',
  providers: [AttendanceRegService]
})
export class AttendanceRegComponent {
  // Local Variables 
  title = 'HR Reports';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  bPrint: boolean = false;
  bAdmin: boolean = false;
  bCompany: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  sort_colname: string = 'log_date';
  searchstring = '';
  attendancedate = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  branch_code: string;
  modal: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";
  BRRECORD: SearchTable = new SearchTable();
  mode = '';
  pkid = '';
  // Array For Displaying List
  RecordList: Auditlog[] = [];
  // Single Record for add/edit/view details
  Record: Auditlog = new Auditlog;

  constructor(
    private modalService: NgbModal,
    private mainService: AttendanceRegService,
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
    this.bPrint = false;
    this.bAdmin = false;
    this.bCompany = false;
    this.branch_code = this.gs.globalVariables.branch_code;
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
    this.attendancedate = this.gs.defaultValues.today.trim();
    this.sort_colname = "log_date";
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
    if (this.attendancedate.trim().length <= 0) {
      this.ErrorMessage += " | Date Cannot be Blank";
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
      sort_colname: this.sort_colname,
      attendancedate: this.attendancedate,
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

    if (field == 'searchstring') {
      this.searchstring = this.searchstring.toUpperCase();
    }

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
