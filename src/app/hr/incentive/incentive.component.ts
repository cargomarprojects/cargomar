import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { sal_incentived, sal_incentivem } from '../models/sal_incentivem';
import { SalIncentiveService } from '../services/salincentive.service';

@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  providers: [SalIncentiveService]
})
export class IncentiveComponent {
  // Local Variables 
  title = 'Incentive List';

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  bAdmin = false;
  bEdit = false;

  selectedRowIndex = 0;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  jvdesc = '';
  jvno = 0;
  jvno_ho = 0;

  IncentiveTypeList = [];
  FileList: any[] = [];
  excelall = false;
  csvall = false;


  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: sal_incentivem[] = [];
  // Single Record for add/edit/view details
  Record: sal_incentivem = new sal_incentivem;

  RecordDet: sal_incentived[] = [];


  constructor(
    private mainService: SalIncentiveService,
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
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {
    this.bAdmin = false;
    this.bEdit = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_edit)
        this.bEdit = true;
    }
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LovSelected(_Record: any) {
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
          alert(this.ErrorMessage);
        });
  }


  LoadCombo() {

    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.IncentiveTypeList = response.incentivelist;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }





  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new sal_incentivem();
    this.Record.salh_pkid = this.pkid;
    this.Record.salh_due_months = "";
    this.Record.salh_arears_nos = 0;
    this.Record.rec_mode = this.mode;
    this.Record.salh_edit_code = '{S}';

    this.jvno = 0;
    this.jvno_ho = 0;
    this.jvdesc = '';
    this.RecordDet = [];

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

        this.RecordDet = response.list;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: sal_incentivem) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;

    this.jvno = _Record.salh_jvno;
    this.jvno_ho = _Record.salh_jvno_ho;

    this.jvdesc = "";
    if (_Record.salh_jvno > 0)
      this.jvdesc = _Record.salh_jvno.toString();
    if (_Record.salh_jvno_ho > 0)
      this.jvdesc += "-" + _Record.salh_jvno_ho.toString();


  }


  // Save Data
  Save() {

    if (!this.allvalid())
      return;


    this.IncentiveTypeList.forEach(rec => {
      if (rec.param_pkid == this.Record.salh_incentive_type_id)
        this.Record.salh_incentive_type_name = rec.param_name;
    })


    let _caption = this.mode == "ADD" ? "Process" : "Re-Process"
    if (!confirm(_caption + ' Records')) {
      return;
    }

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

        this.ActionHandler('EDIT', this.Record.salh_pkid)

      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));

        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.gs.isBlank(this.Record.salh_date)) {
      bret = false;
      sError = "\n\r  Due Date Has to be entered";
    }

    if (this.gs.isBlank(this.Record.salh_due_months)) {
      bret = false;
      sError = "\n\r  Due Months Has to be entered";
    }

    if (bret === false)
      alert(sError);
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.salh_pkid == this.Record.salh_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.salh_date = this.Record.salh_date;
      REC.salh_due_months = this.Record.salh_due_months;
      REC.salh_arears_nos = this.Record.salh_arears_nos;

      REC.salh_edit_code = this.Record.salh_edit_code;
      //REC.salh_incentive_type_id = this.Record.salh_incentive_type_id;
      //REC.salh_incentive_type_name = this.Record.salh_incentive_type_name;

      REC.salh_gross_amt = this.Record.salh_gross_amt;
      REC.salh_total_ded = this.Record.salh_total_ded;
      REC.salh_net_amt = this.Record.salh_net_amt;

    }
  }


  OnBlur(field: string, rec: sal_incentived) {
    let iGross = 0;
    let iDed = 0;
    let iNet = 0;

    let iTds = 0;

    if (field == 'sald_arears_amt') {
      rec.sald_arears_amt = this.gs.roundNumber(rec.sald_arears_amt, 2);
    }
    if (field == 'sald_incentive_amt') {
      rec.sald_incentive_amt = this.gs.roundNumber(rec.sald_incentive_amt, 2);
    }
    if (field == 'sald_allow_amt') {
      rec.sald_allow_amt = this.gs.roundNumber(rec.sald_allow_amt, 2);
    }
    if (field == 'sald_ded_amt') {
      rec.sald_ded_amt = this.gs.roundNumber(rec.sald_ded_amt, 2);
    }
    if (field == 'sald_tds_amt') {
      rec.sald_tds_amt = this.gs.roundNumber(rec.sald_tds_amt, 2);
    }


    iGross = rec.sald_arears_amt + rec.sald_incentive_amt + rec.sald_allow_amt;
    iDed = rec.sald_ded_amt + rec.sald_tds_amt;
    iNet = iGross - iDed;

    iGross = this.gs.roundNumber(iGross, 2);
    iDed = this.gs.roundNumber(iDed, 2);
    iNet = this.gs.roundNumber(iNet, 2);

    rec.sald_gross_amt = iGross;
    rec.sald_total_ded = iDed;
    rec.sald_net_amt = iNet;

    iGross = 0;
    iDed = 0;
    iNet = 0;

    this.RecordDet.forEach(r => {
      iGross += r.sald_gross_amt;
      iDed += r.sald_total_ded;
      iNet += r.sald_net_amt;
      iTds += r.sald_tds_amt;
    });

    iGross = this.gs.roundNumber(iGross, 2);
    iDed = this.gs.roundNumber(iDed, 2);
    iNet = this.gs.roundNumber(iNet, 2);
    iTds = this.gs.roundNumber(iTds, 2);

    this.Record.salh_gross_amt = iGross;
    this.Record.salh_total_ded = iDed;
    this.Record.salh_tds_amt = iTds;
    this.Record.salh_net_amt = iNet;


  }


  UpdateRecord(_rec: sal_incentived) {

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    _rec._globalvariables = this.gs.globalVariables;
    this.mainService.UpdateRecord(_rec)
      .subscribe(response => {
        this.loading = false;
        //alert("Record Updated");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  UpdateHeaderRecord(_rec: sal_incentivem) {

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    _rec._globalvariables = this.gs.globalVariables;
    this.mainService.UpdateHeaderRecord(_rec)
      .subscribe(response => {
        this.loading = false;
        _rec.row_displayed = false;
        _rec.salh_display_date = this.gs.ConvertDate2DisplayFormat(_rec.salh_date);
        _rec.salh_pay_display_date = this.gs.ConvertDate2DisplayFormat(_rec.salh_pay_date);
        // alert("Record Updated");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      pkid: Id,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.Delete(SearchData)
      .subscribe(response => {
        this.loading = false;
        alert("Deleted Successfully");
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.salh_pkid == Id), 1);
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }


  Print(_type: string) {

    this.loading = true;

    let SearchData = {
      pkid: this.pkid,
      type: _type,
      excelall: this.excelall,
      csvall: this.csvall,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      report_folder: this.gs.globalVariables.report_folder
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintList(SearchData)
      .subscribe(response => {
        this.loading = false;

        // this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        this.FileList = response.filelist;
        for (let rec of this.FileList) {
            this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
        }
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  Close() {
    this.gs.ClosePage('home');
  }

  PrintBrSummary() {

    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      report_folder: this.gs.globalVariables.report_folder,
      incentive_type_id: this.Record.salh_incentive_type_id,
      due_date: this.Record.salh_date
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintBrSummary(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }

  PostJV() {
    let Msg: string = "";
    Msg = "Generate JV";

    if (this.jvno > 0)
      Msg = "Re-Generate JV";


    if (!confirm(Msg)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: this.pkid,
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      year_prefix: this.gs.globalVariables.year_prefix,
      year_start_date: this.gs.globalVariables.year_start_date,
      year_end_date: this.gs.globalVariables.year_end_date,
      report_folder: this.gs.globalVariables.report_folder
    };


    this.ErrorMessage = '';

    this.mainService.PostIncentiveJV(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.jvno = response.jvno;
        this.jvno_ho = response.jvno_ho;
        this.jvdesc = "";
        if (response.jvno > 0)
          this.jvdesc = response.jvno.toString();
        if (response.jvno_ho > 0)
          this.jvdesc += "-" + response.jvno_ho;

        alert('JV Generated : ' + response.msg);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  showHeaderUpdate(_rec: sal_incentivem) {
    _rec.row_displayed = !_rec.row_displayed;
  }

}
