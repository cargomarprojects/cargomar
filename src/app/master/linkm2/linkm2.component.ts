import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Linkm2 } from '../models/linkm2';
import { Linkm2Service } from '../services/linkm2.service';
import { SearchTable } from '../../shared/models/searchtable';
import { targetlistm } from '../models/targetlistm';
@Component({
  selector: 'app-linkm2',
  templateUrl: './linkm2.component.html',
  providers: [Linkm2Service]
})
export class Linkm2Component {
  // Local Variables 
  title = 'Master Linking';

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  tl_pkid = '';
  mode = '';
  pkid = '';
  targetcode: string = "";
  targetname: string = "";
  source_table = 'MEXICO-TMM';
  source_type = 'SHIPPER';
  source_typedet = 'SHIPPER';

  PARTYRECORD: SearchTable = new SearchTable();

  RecordList2: targetlistm[] = [];

  // Array For Displaying List
  RecordList: Linkm2[] = [];
  // Single Record for add/edit/view details
  Record: Linkm2 = new Linkm2;
  constructor(
    private mainService: Linkm2Service,
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
    this.List('NEW');
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

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
      this.Record.sourcename = "";
    }
    if (_type == 'CONTAINER') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "CONTAINER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "CONTAINER TYPE";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      this.Record.sourcename = "";
    }
    if (_type == 'SEA CARRIER') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "SEA CARRIER";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "SEA CARRIER";
      this.PARTYRECORD.where = "";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
      this.PARTYRECORD.parentid = "";
      this.Record.sourcename = "";
    }
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


  }


  LovSelected(_Record: any) {
    if (_Record.controlname == "CUSTOMER" || _Record.controlname == "CONTAINER" || _Record.controlname == "SEA CARRIER") {
      this.Record.sourceid = _Record.id;
      this.Record.sourcecode = _Record.code;
      this.Record.sourcename = _Record.name;
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
      this.initlov('CUSTOMER');
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
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

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      source_table: this.source_table,
      source_type: this.source_type,
      branch_code: ''
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new Linkm2();
    this.Record.pkid = this.pkid;
    this.Record.branchcode = "";
    this.Record.sourcetable = this.source_table;
    this.Record.sourcetype = this.source_typedet;
    this.Record.rec_mode = this.mode;

  }


  LoadData(_Record: Linkm2) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
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
    if (this.Record.sourcetable.trim().length <= 0) {
      bret = false;
      sError = " | Source Table Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
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
    }
  }
  OnChange(field: string) {
    if (field == 'sourcetype') {
      this.RecordList2 = new Array<targetlistm>();
      this.source_typedet = this.Record.sourcetype;
      if (this.Record.sourcetype == "CONTAINER" || this.Record.sourcetype == "SEA CARRIER")
        this.initlov(this.Record.sourcetype);
      else
        this.initlov('CUSTOMER');
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
