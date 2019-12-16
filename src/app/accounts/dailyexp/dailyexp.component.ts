import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Dailyexpm } from '../models/dailyexpm';
import { DailyExpService } from '../services/dailyexp.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Dailyexpd } from '../models/dailyexpd';

@Component({
  selector: 'app-dailyexp',
  templateUrl: './dailyexp.component.html',
  providers: [DailyExpService]
})
export class DailyExpComponent {
  // Local Variables 
  title = 'Daily Expense';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  bChanged: boolean;

  bAdmin = false;
  bDocs = false;
  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: Dailyexpm[] = [];
  // Single Record for add/edit/view details
  Record: Dailyexpm = new Dailyexpm;

  PARTYRECORD: SearchTable = new SearchTable();
  PARTYADDRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: DailyExpService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
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
    this.bDocs = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
    this.InitLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {
    // this.loading = true;
    // let SearchData = {
    //   type: 'type',
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code
    // };

    // this.ErrorMessage = '';
    // this.InfoMessage = '';
    // this.mainService.LoadDefault(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.StatusList = response.statuslist;
    //     this.ContainerList = response.containerlist;
    //     this.List("NEW");
    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //     });

    //this.List("NEW");
  }


  InitLov() {

    this.PARTYRECORD = new SearchTable();
    this.PARTYRECORD.controlname = "PARTY";
    this.PARTYRECORD.displaycolumn = "CODE";
    this.PARTYRECORD.type = "CUSTOMER";
    this.PARTYRECORD.where = "";
    this.PARTYRECORD.id = "";
    this.PARTYRECORD.code = "";
    this.PARTYRECORD.name = "";

    this.PARTYADDRECORD = new SearchTable();
    this.PARTYADDRECORD.controlname = "PARTYADDRESS";
    this.PARTYADDRECORD.displaycolumn = "CODE";
    this.PARTYADDRECORD.type = "CUSTOMERADDRESS";
    this.PARTYADDRECORD.id = "";
    this.PARTYADDRECORD.code = "";
    this.PARTYADDRECORD.name = "";
    this.PARTYADDRECORD.parentid = "";

  }

  LovSelected(_Record: SearchTable) {

    let bchange: boolean = false;

    if (_Record.controlname == "PARTY") {
      bchange = false;
      if (this.Record.dem_party_id != _Record.id)
        bchange = true;

      this.Record.dem_party_id = _Record.id;
      this.Record.dem_party_code = _Record.code;
      this.Record.dem_party_name = _Record.name;

      if (bchange) {
        this.PARTYADDRECORD = new SearchTable();
        this.PARTYADDRECORD.controlname = "PARTYADDRESS";
        this.PARTYADDRECORD.displaycolumn = "CODE";
        this.PARTYADDRECORD.type = "CUSTOMERADDRESS";
        this.PARTYADDRECORD.id = "";
        this.PARTYADDRECORD.code = "";
        this.PARTYADDRECORD.name = "";
        this.PARTYADDRECORD.parentid = this.Record.dem_party_id;
        this.Record.dem_party_br_addr = "";
      }

    }
    if (_Record.controlname == "PARTYADDRESS") {
      this.Record.dem_party_br_id = _Record.id;
      this.Record.dem_party_br_no = _Record.code;
      this.Record.dem_party_br_addr = this.GetBrAddress(_Record.name).address;
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
      id = this.pkid;
      this.GetRecord(id);
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
      page_rowcount: this.page_rowcount,
      from_date: this.gs.globalData.mbl_fromdate,
      to_date: this.gs.globalData.mbl_todate
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
    this.Record = new Dailyexpm();
    this.Record.dem_pkid = this.pkid;
    this.Record.dem_cfno = null;
    this.Record.dem_date = this.gs.defaultValues.today;
    this.Record.dem_genjob_id = '';
    this.Record.dem_genjob_no = '';
    this.Record.dem_party_id = '';
    this.Record.dem_party_code = '';
    this.Record.dem_party_name = '';
    this.Record.dem_party_br_id = '';
    this.Record.dem_party_br_no = '';
    this.Record.dem_party_br_addr = '';
    this.Record.dem_inv_date = '';
    this.Record.dem_exp_date = '';
    this.Record.dem_genjob_prefix = '';

    this.Record.lock_record = false;
    this.Record.dem_edit_code = '{S}';
    // this.Record.BkmCntrList = new Array<BkmCntrtype>();
    this.InitDefault();
    this.InitLov();
    this.Record.rec_mode = this.mode;

  }

  InitDefault() {
    // if (this.StatusList != null) {
    //   var REC = this.StatusList.find(rec => rec.param_name == 'PENDING');
    //   if (REC != null) {
    //     this.Record.book_status_id = REC.param_pkid;
    //   }
    // }

  }
  // Load a single Record for VIEW/EDIT 
  GetRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      mode: this.mode,
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

  LoadData(_Record: Dailyexpm) {
    this.Record = _Record;
    this.Record.ExpList = _Record.ExpList;
    this.Record.rec_mode = this.mode;
    if (this.mode == "ADD")
      this.Record.dem_cfno = null;
      
    if (this.mode == "EDIT") {

      this.InitLov();

      this.PARTYRECORD.id = this.Record.dem_party_id;
      this.PARTYRECORD.code = this.Record.dem_party_code;
      this.PARTYRECORD.name = this.Record.dem_party_name;
      this.PARTYADDRECORD.id = this.Record.dem_party_br_id;
      this.PARTYADDRECORD.code = this.Record.dem_party_br_no;
      this.PARTYADDRECORD.parentid = this.Record.dem_party_id;
    }

  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    // this.FindCntrTotal();
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.dem_cfno = response.cfno;
          this.InfoMessage = "New Record " + this.Record.dem_cfno + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        alert(this.InfoMessage);
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
    if (this.Record.dem_date.trim().length <= 0) {
      bret = false;
      sError = " | Date Cannot Be Blank";
    }
    if (this.Record.dem_party_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Party Cannot Be Blank";
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.dem_pkid == this.Record.dem_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.dem_cfno = this.Record.dem_cfno;
      REC.dem_date = this.Record.dem_date;
      REC.dem_party_name = this.Record.dem_party_name;
    }
  }


  OnBlur(field: string, _rec: Dailyexpd = null) {
    var oldChar2 = / /gi;//replace all blank space in a string
    // if (field == 'book_exporter_name') {
    //   this.Record.book_exporter_name = this.Record.book_exporter_name.toUpperCase();
    // }

    // if (field == 'book_mblno') {
    //   this.Record.book_mblno = this.Record.book_mblno.replace(oldChar2, '').toUpperCase();
    // }

    if (field == 'dem_genjob_no') {
      this.Record.dem_genjob_no = this.Record.dem_genjob_no.toUpperCase();
      this.Record.dem_genjob_id = '';
      this.Record.dem_genjob_prefix = '';
      this.SearchRecord('dem_genjob_no');
    }

  }

  OnChange(field: string) {
    // let TotTeu: number = 0;

    // if (field == 'book_m20' || field == 'book_m40') {
    //   TotTeu = this.Record.book_m20 + (this.Record.book_m40 * 2);
    //   this.Record.book_mteu = TotTeu;
    // }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }
    return AddressSplit;
  }

  SearchRecord(controlname: string) {
    if (this.Record.dem_genjob_no.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'genjobm',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      gen_jobno: ''
    };
    if (controlname == 'dem_genjob_no') {
      SearchData.rowtype = this.type;
      SearchData.table = 'genjobm';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.gen_jobno = this.Record.dem_genjob_no;
    }
    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.dem_genjob_id = '';
        this.ErrorMessage = '';
        if (response.genjobm.length > 0) {
          this.Record.dem_genjob_id = response.genjobm[0].gj_pkid;
          this.Record.dem_genjob_prefix = response.genjobm[0].gj_job_prefix;

        }
        else {
          this.ErrorMessage = 'Invalid General Job';
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  FindCntrTotal() {
    // let TotTeu: number = 0;
    // let n20: number = 0;
    // let n40: number = 0;
    // var temparr = null;
    // for (let rec of this.Record.BkmCntrList) {
    //   if (rec.bcntr_type_id != "") {
    //     if (this.ContainerList != null) {
    //       var REC = this.ContainerList.find(_rec => _rec.param_pkid == rec.bcntr_type_id);
    //       if (REC != null) {
    //         if (+REC.param_id1 == 20)
    //           n20 += rec.bcntr_qty;
    //         if (+REC.param_id1 == 40)
    //           n40 += rec.bcntr_qty;
    //       }
    //     }
    //   }
    // }

    // if (this.Record.BkmCntrList.length >= 1) {
    //   this.Record.book_m20 = n20;
    //   this.Record.book_m40 = n40;
    //   TotTeu = this.Record.book_m20 + (this.Record.book_m40 * 2);
    //   this.Record.book_mteu = TotTeu;
    // }
  }


}
