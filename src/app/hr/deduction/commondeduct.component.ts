import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Salarym } from '../models/salarym';
import { SalDet } from '../models/salarym';
import { SalaryMasterService } from '../services/salarymaster.service';


@Component({
  selector: 'app-commondeduct',
  templateUrl: './commondeduct.component.html',
  providers: [SalaryMasterService]
})
export class CommonDeductComponent {
  // Local Variables 
  title = 'TDS';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex = 0;

  bChanged: boolean;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  bPrint: boolean = false;
  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  lock_record: boolean = false;
  porttype = 'PORT';

  ErrorMessage = "";
  InfoMessage = "";

  SalDetails: any[] = [];
  mode = '';
  pkid = '';
  // Array For Displaying List
  RecordList: Salarym[] = [];
  // Single Record for add/edit/view details
  Record: Salarym = new Salarym;
  Recorddet: SalDet = new SalDet;

  constructor(
    private mainService: SalaryMasterService,
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
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
    this.InitLov();
    this.List("NEW");
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }


  // Query List Data
  List(_type: string) {

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
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
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
          this.Recorddet = response.record;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  OnBlur(field: string, _rec: Salarym) {
    if (field == 'D03') {
      _rec.d03 = this.gs.roundNumber(_rec.d03, 2);
    }
    if (field == 'D09') {
      _rec.d09 = this.gs.roundNumber(_rec.d09, 2);
    }
    if (field == 'D13') {
      _rec.d13 = this.gs.roundNumber(_rec.d13, 2);
    }
    // if (field == 'sal_is_esi') {

    // }
    //if (field == 'sal_head') {
    //  this.Record.sal_head = this.Record.sal_head.toUpperCase();
    //}
  }
  
  UpdateRecord(_rec: Salarym) {

    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    _rec._globalvariables = this.gs.globalVariables;
    this.mainService.UpdateRecord(_rec)
      .subscribe(response => {
        this.loading = false;
        alert("Save Complete");
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

    //   if (this.Record.ded_mon_amt > this.Record.ded_paid_amt) {
    //     bret = false;
    //     sError += "\n\r | Invalid  Amount ";
    // }

    // if (bret === false) {
    //   this.ErrorMessage = sError;
    //   alert(this.ErrorMessage);
    // }
    if (bret) {

    }
    return bret;
  }



  Close() {
    this.gs.ClosePage('home');
  }

}
