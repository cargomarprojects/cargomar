import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { EdiLinkm } from '../models/edilinkm';
import { EdilinkService } from '../services/edilink.service';
import { SearchTable } from '../../shared/models/searchtable';
import { targetlistm } from '../../master/models/targetlistm';
import { Param } from '../../master/models/param';
@Component({
  selector: 'app-edilink',
  templateUrl: './edilink.component.html',
  providers: [EdilinkService]
})
export class EdilinkComponent {
  // Local Variables
  title = 'Master Linking';

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() link_type: string = '';
  @Input() link_pkid: string = '';
  @Input() search_value1: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchpending: string = 'ALL';
  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  selectedRowIndex = 0;

  sub: any;
  urlid: string;

  showCloseBtn: boolean = false;
  ErrorMessage = "";
  InfoMessage = "";
  bpending: boolean = true;
  bAdmin: boolean = false;
  bDelete: boolean = false;
  tl_pkid = '';
  mode = '';
  pkid = '';
  targetcode: string = "";
  targetname: string = "";
  source_table = 'MEXICO-TMM';
  search_source_table = 'MEXICO-TMM';
  source_type = 'ALL';
  source_typedet = 'ALL';
  SourceTypeList: any[] = [];
  TradingPartnerList: Param[] = [];
  Value1TypeList: any[] = [];
  PARTYRECORD: SearchTable = new SearchTable();

  RecordList2: targetlistm[] = [];

  // Array For Displaying List
  RecordList: EdiLinkm[] = [];
  // Single Record for add/edit/view details
  Record: EdiLinkm = new EdiLinkm;
  constructor(
    private mainService: EdilinkService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 15;
    this.page_current = 0;

    // URL Query Parameter
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        if (this.menuid == "LINKM2")
          this.showCloseBtn = true;
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (this.type) {
      this.source_table = this.type;
      this.search_source_table = this.source_table;
      this.InitCompleted = false;
    }

    if (!this.InitCompleted) {
      this.InitComponent();
    }

    this.FillSourceTypeList(this.source_table);
    // this.List('NEW');
    // if (this.link_pkid) {
    //     this.ActionHandler('EDIT', this.link_pkid, this.link_type)
    // }
  }

  InitComponent() {
    this.searchpending = "ALL";
    this.bAdmin = false;
    this.bDelete = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      this.bDelete = this.menu_record.rights_delete;
    }

    this.LoadCombo();

  }

  initlov(_type: string) {
    if (_type == 'CUSTOMER') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "CUSTOMER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "CUSTOMER";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
    else if (_type == 'CONTAINER') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "CONTAINER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "CONTAINER TYPE";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
    else if (_type == 'SEA CARRIER') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "SEA CARRIER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "SEA CARRIER";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
    else if (_type == 'AIR CARRIER') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "AIR CARRIER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "AIR CARRIER";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
    else if (_type == 'CUSTOMER PLUS ADDRESS') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "CUSTOMER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "CUSTOMER PLUS ADDRESS";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
    else if (_type == 'DISTRICT') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "DISTRICT";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "DISTRICT";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "EDI";
      // this.Record.sourcename = "";
    }
    else if (_type == 'PLACE-OF-RECEIPT') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "PLACE-OF-RECEIPT";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "CITY";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
    else {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = _type;
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = _type;
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      // this.Record.sourcename = "";
    }
  }


  // Destroy Will be called when this component is closed PLACE-OF-RECEIPT
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  LoadCombo() {

    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.TradingPartnerList = response.tplist;

        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = JSON.parse(error._body).Message;
        });


  }


  LovSelected(_Record: any) {
    // if (_Record.controlname == "CUSTOMER" || _Record.controlname == "CONTAINER" || _Record.controlname == "SEA CARRIER") {
    //   this.Record.sourceid = _Record.id;
    //   this.Record.sourcecode = _Record.code;
    //   this.Record.sourcename = _Record.name;
    // }
    this.Record.sourceid = _Record.id;
    this.Record.sourcecode = _Record.code;
    this.Record.sourcename = _Record.name;
    if (this.Record.sourcetable == "JOB") {
      this.Record.targetid = _Record.code;
      this.Record.targetdesc = _Record.name;
    }
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _sourceType: string = '') {
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
      this.GetRecord(id, _sourceType);
      this.initlov('CUSTOMER');
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
    this.search_source_table = this.source_table;
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      source_table: this.source_table,
      source_type: this.source_type,
      branch_code: '',
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      bpending: this.bpending,
      searchpending: this.searchpending,
      search_value1: this.search_value1
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.search_value1 = '';
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



  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new EdiLinkm();
    this.Record.pkid = this.pkid;
    this.Record.branchcode = "";
    this.Record.searchstring = "";
    this.Record.sourceid = "";
    this.Record.sourcecode = "";
    this.Record.sourcename = "";
    this.Record.targetid = "";
    this.Record.targetdesc = "";
    this.Record.sourcetable = this.source_table;
    this.Record.sourcetype = this.source_typedet;
    this.Record.rec_mode = this.mode;
    this.setLovType();
  }

  //  Load a single Record for VIEW/EDIT
  GetRecord(Id: string, _sourceType: string = '') {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      source_type: _sourceType
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


  LoadData(_Record: EdiLinkm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.setLovType();
    this.PARTYRECORD.id = this.Record.sourceid;
    this.PARTYRECORD.code = this.Record.sourcecode;
    this.PARTYRECORD.name = this.Record.sourcename;
    this.FillSourceTypeList(this.Record.sourcetable);
    this.FillValue1TypeList(this.Record.sourcetype);
  }


  // Save Data
  Save() {

    if (!this.allvalid())
      return;

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
        this.ActionHandler('LIST', '');
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
    if (this.Record.sourcetable.trim().length <= 0) {
      bret = false;
      sError = " | Source Table Cannot Be Blank";
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
    var REC = this.RecordList.find(rec => rec.pkid == this.Record.pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.sourcetable = this.Record.sourcetable;
      REC.sourcetype = this.Record.sourcetype;
      REC.searchstring = this.Record.searchstring;
      REC.sourcecode = this.Record.targetid;
      REC.sourcename = this.Record.targetdesc;
    }
  }


  OnBlur(field: string) {
    switch (field) {
      case 'targetid':
        {
          this.Record.targetid = this.Record.targetid.toUpperCase();
          break;
        }
      case 'targetdesc':
        {
          this.Record.targetdesc = this.Record.targetdesc.toUpperCase();
          break;
        }
      case 'searchstring':
        {
          this.Record.searchstring = this.Record.searchstring.toUpperCase();
          break;
        }
      case 'targetcode':
        {
          this.targetcode = this.targetcode.toUpperCase();
          break;
        }
      case 'targetname':
        {
          this.targetname = this.targetname.toUpperCase();
          break;
        }
      case 'searchstring2':
        {
          this.searchstring = this.searchstring.toUpperCase();
          break;
        }
    }
  }

  isComboList(_type: string) {
    if (_type == "CARGO-MOVEMENT" || _type == "FREIGHT-TERMS"
      || _type == "CARGO-NATURE" || _type == "NFEI"
      || _type == "PAYMENT-TYPE" || _type == "CONTRACT-NATURE"
      || _type == "JOB-TYPE" || _type == "TRANSPORT-MODE"
      || _type == "IGST-PAYMENT-STATUS" || _type == "STUFFED-AT")
      return true;
    else
      return false;
  }

  OnChange(field: string, _type: string = "") {
    if (field == 'sourcetype') {
      this.RecordList2 = new Array<targetlistm>();
      this.source_typedet = this.Record.sourcetype;
      this.setLovType();
      this.Value1TypeList = new Array<any>();
      if (this.isComboList(this.Record.sourcetype)
      ) {
        this.FillValue1TypeList(this.Record.sourcetype);
      }
    } else if (field == 'source_table') {
      this.RecordList2 = new Array<targetlistm>();
      this.source_typedet = this.Record.sourcetype;
      this.setLovType();
      this.FillSourceTypeList(_type)
    } else if (field == 'sourceid') {
      this.Record.targetid = this.Record.sourceid;
    }

  }

  setLovType() {
    if (this.Record.sourcetable == "JOB") {
      if (this.Record.sourcetype == "SHIPPER" || this.Record.sourcetype == "CONSIGNEE" || this.Record.sourcetype == "BUYER")
        this.initlov('CUSTOMER PLUS ADDRESS');
      else if (this.Record.sourcetype == "BILLED-TO")
        this.initlov('CUSTOMER');
      else
        this.initlov(this.Record.sourcetype);
    } else {

      if (this.Record.sourcetype == "SHIPPER" || this.Record.sourcetype == "CONSIGNEE")
        this.initlov('CUSTOMER');
      else
        this.initlov(this.Record.sourcetype);
    }
  }

  FillSourceTypeList(_type: string) {
    this.SourceTypeList = new Array<any>();
    if (_type == "JOB") {
      this.SourceTypeList = [
        { "code": "ALL", "name": "ALL" },
        { "code": "BILLED-TO", "name": "BILLED-TO" },
        { "code": "BUYER", "name": "BUYER" },
        { "code": "CARGO-MOVEMENT", "name": "CARGO-MOVEMENT" },
        { "code": "CARGO-NATURE", "name": "CARGO-NATURE" },
        { "code": "CITY", "name": "CITY" },
        { "code": "COMMODITY", "name": "COMMODITY" },
        { "code": "CONSIGNEE", "name": "CONSIGNEE" },
        { "code": "CONTRACT-NATURE", "name": "CONTRACT-NATURE" },
        { "code": "COUNTRY", "name": "COUNTRY" },
        { "code": "CURRENCY", "name": "CURRENCY" },
        { "code": "DISTRICT", "name": "DISTRICT" },
        { "code": "DRAWBACK", "name": "DRAWBACK" },
        { "code": "FREIGHT-TERMS", "name": "FREIGHT-TERMS" },
        { "code": "IGST-PAYMENT-STATUS", "name": "IGST-PAYMENT-STATUS" },
        { "code": "JOB-TYPE", "name": "JOB-TYPE" },
        { "code": "NFEI", "name": "NFEI" },
        { "code": "PLACE-OF-RECEIPT", "name": "PLACE-OF-RECEIPT" },
        { "code": "PAYMENT-TYPE", "name": "PAYMENT-TYPE" },
        { "code": "PORT", "name": "PORT" },
        { "code": "PRE CARRIAGE", "name": "PRE CARRIAGE" },
        { "code": "RITCM", "name": "RITCM" },
        { "code": "SCHEME CODE", "name": "SCHEME CODE" },
        { "code": "SHIPPER", "name": "SHIPPER" },
        { "code": "STATE", "name": "STATE" },
        { "code": "STUFFED-AT", "name": "STUFFED-AT" },
        { "code": "TRADE AGREEMENTS", "name": "TRADE AGREEMENTS" },
        { "code": "TRANSPORT-MODE", "name": "TRANSPORT-MODE" },
        { "code": "UNIT", "name": "UNIT" }
      ];

    } else {

      this.SourceTypeList = [
        { "code": "ALL", "name": "ALL" },
        { "code": "SHIPPER", "name": "SHIPPER" },
        { "code": "CONSIGNEE", "name": "CONSIGNEE" },
        { "code": "USPORT", "name": "USPORT" },
        { "code": "SHIPPER-GROUP", "name": "SHIPPER-GROUP" },
        { "code": "CONTAINER", "name": "CONTAINER" },
        { "code": "CONTAINER SERVICE CODE", "name": "CONTAINER SERVICE CODE" },
        { "code": "AIR CARRIER", "name": "AIR CARRIER" },
        { "code": "SEA CARRIER", "name": "SEA CARRIER" }
      ];
    }
  }

  FillValue1TypeList(_type: string) {
    this.Value1TypeList = new Array<any>();
    if (_type == "CARGO-MOVEMENT") {
      this.Value1TypeList = [
        { "code": "FCL/FCL", "name": "FCL/FCL" },
        { "code": "FCL/LCL", "name": "FCL/LCL" },
        { "code": "LCL", "name": "LCL" },
        { "code": "LCL/FCL", "name": "LCL/FCL" },
        { "code": "LCL/LCL", "name": "LCL/LCL" }
      ];
    } else if (_type == "FREIGHT-TERMS") {
      this.Value1TypeList = [
        { "code": "EX-WORK", "name": "EX-WORK" },
        { "code": "FREIGHT COLLECT", "name": "FREIGHT COLLECT" },
        { "code": "FREIGHT PREPAID", "name": "FREIGHT PREPAID" }
      ];
    } else if (_type == "CARGO-NATURE") {
      this.Value1TypeList = [
        { "code": "N", "name": "NA" },
        { "code": "C", "name": "Containerized Cargo" },
        { "code": "CP", "name": "Containerized & Packaged cargo" },
        { "code": "P", "name": "Packaged Cargo" },
        { "code": "LB", "name": "Liquid Bulk" },
        { "code": "DB", "name": "Dry Bulk" }
      ];
    } else if (_type == "NFEI") {
      this.Value1TypeList = [
        { "code": "Y", "name": "Y" },
        { "code": "N", "name": "N" }
      ];
    } else if (_type == "PAYMENT-TYPE") {
      this.Value1TypeList = [
        { "code": "NA", "name": "NA" },
        { "code": "AP", "name": "AP" },
        { "code": "DA", "name": "DA" },
        { "code": "DP", "name": "DP" },
        { "code": "LC", "name": "LC" }
      ];
    } else if (_type == "CONTRACT-NATURE") {
      this.Value1TypeList = [
        { "code": "FOB", "name": "FOB" },
        { "code": "CF", "name": "CF" },
        { "code": "CI", "name": "CI" },
        { "code": "CIF", "name": "CIF" },

      ];
    } else if (_type == "IGST-PAYMENT-STATUS") {
      this.Value1TypeList = [
        { "code": "LUT", "name": "LUT" },
        { "code": "P", "name": "PAID" },
      ];
    } else if (_type == "STUFFED-AT") {
      this.Value1TypeList = [
        { "code": "DOCK", "name": "DOCK" },
        { "code": "FACTORY", "name": "FACTORY" },
      ];
    } else if (_type == "JOB-TYPE") {
      this.Value1TypeList = [
        { "code": "BOTH", "name": "BOTH" },
        { "code": "CLEARING", "name": "CLEARING" },
        { "code": "FORWARDING", "name": "FORWARDING" },
      ];
    } else if (_type == "TRANSPORT-MODE") {
      this.Value1TypeList = [
        { "code": "AIR EXPORT", "name": "AIR EXPORT" },
        { "code": "SEA EXPORT", "name": "SEA EXPORT" },
      ];
    }


  }
  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.pkid == Id), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Close() {
    this.gs.ClosePage('home');
  }

  Remove(_id: string, _Code: string) {

    if (!confirm("Do you want to Delete " + _Code)) {
      return;
    }
    this.tl_pkid = _id;
    this.SearchRecord('targetlistm', 'DELETE');
  }

  SearchRecord(controlname: string, _type: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (_type == "SAVE") {
      if (this.targetcode.length <= 0) {
        this.ErrorMessage += " | Code cannot be blank"
        alert(this.ErrorMessage);
        return;
      }
    }
    this.loading = true;
    let SearchData = {
      table: controlname,
      pkid: this.tl_pkid,
      type: _type,
      rowtype: this.type,
      searchstring: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      sourcetable: '',
      sourcetype: '',
      targetcode: '',
      targetname: ''
    };

    SearchData.table = controlname;
    SearchData.pkid = this.tl_pkid;
    SearchData.type = _type;
    SearchData.rowtype = this.type;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.sourcetable = this.Record.sourcetable;
    SearchData.sourcetype = this.Record.sourcetype;
    SearchData.targetcode = this.targetcode;
    SearchData.targetname = this.targetname;
    SearchData.searchstring = '';

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';

        if (_type == "LIST")
          this.RecordList2 = response.list;
        if (_type == "SAVE") {
          if (response.serror.length > 0) {
            this.ErrorMessage = response.serror;
            alert(this.ErrorMessage);
          } else {
            this.targetcode = "";
            this.targetname = "";
            if (this.RecordList2 != null)
              this.RecordList2.push(response.rec);
          }
        }
        if (_type == "DELETE") {
          this.RecordList2.splice(this.RecordList2.findIndex(rec => rec.tl_pkid == this.tl_pkid), 1);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  Settargetvalue(_rec: targetlistm) {
    this.Record.targetid = _rec.tl_code;
    this.Record.targetdesc = _rec.tl_name;
  }
}
