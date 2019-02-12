import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { TdsCertm } from '../models/tdscertm';
import { TdsCertReportService } from '../services/tdscertreport.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-tdscertreport',
  templateUrl: './tdscertreport.component.html',
  providers: [TdsCertReportService]
})
export class TdsCertReportComponent {
  // Local Variables 
  title = 'TDS CERTIFICATE DETAILS';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;


  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  levyear = 0;
  levmonth = 0;
  tot_pl = 0;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  bChanged: boolean = false;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: TdsCertm[] = [];
  // Single Record for add/edit/view details
  Record: TdsCertm = new TdsCertm;
  BRRECORD: SearchTable = new SearchTable();
  TANRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: TdsCertReportService,
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
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.InitLov();
    this.LoadCombo();
    this.levyear = +this.gs.globalVariables.year_code;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

    //this.loading = true;
    //let SearchData = {
    //  type: 'type',
    //  comp_code: this.gs.globalVariables.comp_code,
    //  branch_code: this.gs.globalVariables.branch_code
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //  .subscribe(response => {
    //    this.loading = false;
    //    this.StatusList = response.statuslist;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = this.gs.getError(error);
    //  });

    this.List("NEW");
  }


  InitLov() {

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;
    this.BRRECORD.name = this.gs.globalVariables.branch_name;


    this.TANRECORD = new SearchTable();
    this.TANRECORD.controlname = "TAN";
    this.TANRECORD.displaycolumn = "CODE";
    this.TANRECORD.type = "TAN";
    this.TANRECORD.id = "";
    this.TANRECORD.code = "";
    this.TANRECORD.name = "";
  }
  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "TAN") {
      this.Record.tds_tanid = _Record.id;
      this.Record.tds_tancode = _Record.code;
      this.Record.tds_tanname = _Record.name;
    }
    if (_Record.controlname == "BRANCH") {
      this.Record.tds_cert_brcode = _Record.code;
      this.Record.tds_cert_brname = _Record.name;
    }
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }

  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    if (this.mode == "EDIT")
      return this.disableSave;
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
      levmonth: this.levmonth,
      levyear: this.levyear,
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
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new TdsCertm();
    this.Record.tds_pkid = this.pkid;
    this.Record.tds_cert_no = '';
    this.Record.tds_cert_qtr = 'Q1';
    this.Record.tds_cert_brcode = this.gs.globalVariables.branch_code;
    this.Record.tds_cert_brname = this.gs.globalVariables.branch_name;
    this.Record.tds_tanid = '';
    this.Record.tds_tancode = '';
    this.Record.tds_tanname = '';
    this.Record.tds_gross = 0;
    this.Record.tds_amt = 0;

    this.InitLov();
    this.Record.rec_mode = this.mode;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: TdsCertm) {
    this.Record = _Record;
    this.InitLov();
    this.TANRECORD.id = this.Record.tds_tanid;
    this.TANRECORD.code = this.Record.tds_tancode;
    this.TANRECORD.name = this.Record.tds_tanname;
    this.BRRECORD.code = this.Record.tds_cert_brcode;
    this.BRRECORD.name = this.Record.tds_cert_brname;
    this.Record.rec_mode = this.mode;
    //this.FindTotPL();
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    // this.FindTotPL();
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.tds_cert_no.length <= 0) {
      bret = false;
      sError += "\n\r | Certificate Cannot be blank ";
    }
    if (this.Record.tds_cert_brcode.length <= 0) {
      bret = false;
      sError += "\n\r | Certificate Received At cannot be blank ";
    }
    if (this.Record.tds_tanid.length <= 0) {
      bret = false;
      sError = "\n\r | Invalid TAN# ";
    }

    if (this.Record.tds_gross <= 0) {
      bret = false;
      sError += "\n\r | Invalid Grosss Amount  ";
    }

    if (this.Record.tds_amt <= 0) {
      bret = false;
      sError += "\n\r | Invalid Certificate Amount ";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.tds_pkid == this.Record.tds_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.tds_tancode = this.Record.tds_tancode;
      REC.tds_tanname = this.Record.tds_tanname;
      REC.tds_cert_no = this.Record.tds_cert_no;
      REC.tds_cert_qtr = this.Record.tds_cert_qtr;
      REC.tds_gross = this.Record.tds_gross;
      REC.tds_amt = this.Record.tds_amt;
    }
  }

  OnFocus(field: string) {
    // if (field == 'lev_pl' || field == 'lev_pl_carry')
    //   this.bChanged = false;
  }
  OnChange(field: string) {
    // if (field == 'lev_pl' || field == 'lev_pl_carry')
    //   this.bChanged = true;
  }
  OnBlur(field: string) {
    switch (field) {
      case 'tds_cert_no':
        {
          this.Record.tds_cert_no = this.Record.tds_cert_no.toUpperCase();
          break;
        }
      case 'Search':
        {
          this.searchstring = this.searchstring.toUpperCase();
          break;
        }
      case 'tds_gross':
        {
          this.Record.tds_gross = this.gs.roundNumber(this.Record.tds_gross, 2);
          break;
        }
      case 'tds_amt':
        {
          this.Record.tds_amt = this.gs.roundNumber(this.Record.tds_amt, 2);
          break;
        }
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }


  // Query List Data
  FindTotPL() {
    // this.tot_pl = this.Record.lev_pl + this.Record.lev_pl_carry;
    // this.tot_pl = this.gs.roundNumber(this.tot_pl, 1);
  }

  TdsDetList(_Record: TdsCertm) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      tanid: _Record.tds_tanid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };
    
    this.mainService.TdsDetList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.TdsDetList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
