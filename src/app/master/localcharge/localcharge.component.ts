import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LocalCharge } from '../models/localcharge';
import { LocalChargeService } from '../services/localcharge.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Local } from 'protractor/built/driverProviders';
import { DateComponent } from '../../shared/date/date.component';

@Component({
  selector: 'app-localcharge',
  templateUrl: './localcharge.component.html',
  providers: [LocalChargeService]
})
export class LocalChargeComponent {
  // Local Variables 
  title = 'Local Charges';

  // @ViewChild('addressComponent') addressComponent: any;
  @ViewChild('_lc_valid_from') private lc_valid_from_ctrl: DateComponent;
  @ViewChild('_lc_valid_to') private lc_valid_to_ctrl: DateComponent;

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  bDocs: boolean = false;
  ispercent = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  bPrint = false;
  bDelete = false;

  selectedRowIndex = 0;

  dbkmode = '';
  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  modal: any;
  fromdate: string = "";
  todate: string = "";
  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  POLRECORD: any = {};
  PODRECORD: any = {};
  LINERRECORD: any = {};
  TRADELANERECORD: any = {};
  CURRECORD: any = {};
  CUROTHRECORD: any = {};
  // Array For Displaying List
  RecordList: LocalCharge[] = [];
  // Single Record for add/edit/view details
  Record: LocalCharge = new LocalCharge;

  constructor(
    private modalService: NgbModal,
    private mainService: LocalChargeService,
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
    this.bDocs = false;
    this.fromdate = this.gs.defaultValues.monthbegindate;
    this.todate = '';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.bPrint = this.menu_record.rights_print;
      this.bDelete = this.menu_record.rights_delete;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
    this.LoadCombo();
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

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });
    this.List("NEW");
  }


  LovSelected(_Record: any) {
    if (_Record.controlname == "POL") {
      this.Record.lc_pol_id = _Record.id;
      this.Record.lc_pol_code = _Record.code;
      this.Record.lc_pol_name = _Record.name;
    }
    if (_Record.controlname == "LINER") {
      this.Record.lc_carrier_id = _Record.id;
      this.Record.lc_carrier_code = _Record.code;
      this.Record.lc_carrier_name = _Record.name;
    }
    if (_Record.controlname == "SEALCURR") {
      this.Record.lc_seal_curr = _Record.code;
    }
    if (_Record.controlname == "OTHCURR") {
      this.Record.lc_oth_curr = _Record.code;
    }
  }



  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _brcode: string = '') {
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
      if (_brcode != this.gs.globalVariables.branch_code) {
        alert('Cannot Edit from another Branch')
        return;
      }
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
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      from_date: this.fromdate,
      to_date: this.todate,
      report_folder: this.gs.globalVariables.report_folder
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
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new LocalCharge();
    this.Record.lc_pkid = this.pkid;
    this.Record.rec_mode = this.mode;
    this.Init();
    this.POLRECORD = { 'controlname': 'POL', 'type': 'SEA PORT', displaycolumn: 'CODE', id: '', code: '', name: '' };
    this.LINERRECORD = { 'controlname': 'LINER', 'type': 'SEA CARRIER', displaycolumn: 'CODE', id: '', code: '', name: '' };
    this.CURRECORD = { 'controlname': 'SEALCURR', 'type': 'CURRENCY', displaycolumn: 'CODE', id: '', code: 'INR', name: 'INR' };
    this.CUROTHRECORD = { 'controlname': 'OTHCURR', 'type': 'CURRENCY', displaycolumn: 'CODE', id: '', code: 'INR', name: 'INR' };
  }

  Init() {
    this.Record.rec_branch_code = this.gs.globalVariables.branch_code;
    this.Record.rec_created_by = this.gs.globalVariables.user_code;
    this.Record.rec_created_date = this.getTodaysdate();
    this.Record.lc_pol_id = "";
    this.Record.lc_pol_code = "";
    this.Record.lc_pol_name = "";
    this.Record.lc_carrier_id = "";
    this.Record.lc_carrier_code = "";
    this.Record.lc_carrier_name = "";
    this.Record.lc_valid_from = "";
    this.Record.lc_valid_to = "";
    this.ClearRates();
  }

  getTodaysdate() {
    var tempdt = this.gs.defaultValues.today.split('-');
    return tempdt[2] + '/' + tempdt[1] + '/' + tempdt[0];
  }

  ClearRates() {
    this.Record.lc_dry_20_thc = 0;
    this.Record.lc_dry_40_thc = 0;
    this.Record.lc_reefer_20_thc = 0;
    this.Record.lc_reefer_40_thc = 0;
    this.Record.lc_muc = 0;
    this.Record.lc_seal = 0;
    this.Record.lc_seal_curr = 'INR';
    this.Record.lc_bl = 0;
    this.Record.lc_acd = 0;
    this.Record.lc_ens = 0;
    this.Record.lc_oth = 0;
    this.Record.lc_oth_curr = 'INR';
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
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: LocalCharge) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.POLRECORD = { 'controlname': 'POL', 'type': 'SEA PORT', displaycolumn: 'CODE', id: this.Record.lc_pol_id, code: this.Record.lc_pol_code, name: this.Record.lc_pol_name };
    this.LINERRECORD = { 'controlname': 'LINER', 'type': 'SEA CARRIER', displaycolumn: 'CODE', id: this.Record.lc_carrier_id, code: this.Record.lc_carrier_code, name: this.Record.lc_carrier_name };
    this.CURRECORD = { 'controlname': 'SEALCURR', 'type': 'CURRENCY', displaycolumn: 'CODE', id: '', code: this.Record.lc_seal_curr, name: this.Record.lc_seal_curr };
    this.CUROTHRECORD = { 'controlname': 'OTHCURR', 'type': 'CURRENCY', displaycolumn: 'CODE', id: '', code: this.Record.lc_oth_curr, name: this.Record.lc_oth_curr };
  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.CanSave(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (response.warningmsg.length > 0) {
          if (confirm(response.warningmsg)) {
            this.Save2();
          }
        } else
          this.Save2();

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);

        });
  }

  Save2() {

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
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    // if (this.Record.dbk_slno.trim().length <= 0) {
    //   bret = false;
    //   sError = " | Drawback Code Cannot Be Blank";
    // }

    // if (bret === false)
    //   this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.lc_pkid == this.Record.lc_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
      REC = this.RecordList.find(rec => rec.lc_pkid == this.Record.lc_pkid);
      REC.lc_valid_from = this.lc_valid_from_ctrl.GetDisplayDate();
      REC.lc_valid_to = this.lc_valid_to_ctrl.GetDisplayDate();
    }
    else {
      REC.lc_pol_name = this.Record.lc_pol_name;
      REC.lc_carrier_name = this.Record.lc_carrier_name;
      REC.lc_dry_20_thc = this.Record.lc_dry_20_thc;
      REC.lc_dry_40_thc = this.Record.lc_dry_40_thc;
      REC.lc_reefer_20_thc = this.Record.lc_reefer_20_thc;
      REC.lc_reefer_40_thc = this.Record.lc_reefer_40_thc;
      REC.lc_muc = this.Record.lc_muc;
      REC.lc_seal = this.Record.lc_seal;
      REC.lc_seal_curr = this.Record.lc_seal_curr;
      REC.lc_bl = this.Record.lc_bl;
      REC.lc_valid_from = this.lc_valid_from_ctrl.GetDisplayDate();
      REC.lc_valid_to = this.lc_valid_to_ctrl.GetDisplayDate();
      REC.lc_oth = this.Record.lc_oth;
      REC.lc_oth_curr = this.Record.lc_oth_curr;
    }
  }

  RemoveRecord(Id: string) {

    if (!confirm("DELETE RECORD")) {
      return;
    }

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: Id
    };

    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.lc_pkid == Id), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  OnBlur(field: string) {

    if (field == 'lc_pol_name') {
      this.Record.lc_pol_name = this.Record.lc_pol_name.toUpperCase();
    }
    if (field == 'lc_carrier_name') {
      this.Record.lc_carrier_name = this.Record.lc_carrier_name.toUpperCase();
    }
    if (field == 'Search') {
      this.searchstring = this.searchstring.toUpperCase();
    }

    if (field == 'lc_dry_20_thc') {
      this.Record.lc_dry_20_thc = this.gs.roundNumber(this.Record.lc_dry_20_thc, 2);
    }

    if (field == 'lc_dry_40_thc') {
      this.Record.lc_dry_40_thc = this.gs.roundNumber(this.Record.lc_dry_40_thc, 2);
    }

    if (field == 'lc_reefer_20_thc') {
      this.Record.lc_reefer_20_thc = this.gs.roundNumber(this.Record.lc_reefer_20_thc, 2);
    }

    if (field == 'lc_reefer_40_thc') {
      this.Record.lc_reefer_40_thc = this.gs.roundNumber(this.Record.lc_reefer_40_thc, 2);
    }

    if (field == 'lc_muc') {
      this.Record.lc_muc = this.gs.roundNumber(this.Record.lc_muc, 2);
    }

    if (field == 'lc_seal') {
      this.Record.lc_seal = this.gs.roundNumber(this.Record.lc_seal, 2);
    }

    if (field == 'lc_bl') {
      this.Record.lc_bl = this.gs.roundNumber(this.Record.lc_bl, 2);
    }

    if (field == 'lc_oth') {
      this.Record.lc_oth = this.gs.roundNumber(this.Record.lc_oth, 2);
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  ShowDocuments(doc: any) {
    this.ErrorMessage = '';
    this.open(doc);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

}
