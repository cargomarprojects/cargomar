import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Customerm } from '../models/customer';
import { AddbookService } from '../services/addbook.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  providers: [AddbookService]
})
export class AddbookComponent {
  // Local Variables 
  title = 'Address MASTER';

  @ViewChild('addressComponent') addressComponent: any;


  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  bDocs = false;
  canadd = true;

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

  mode = '';
  pkid = '';

  cust_linked: boolean = false;


  // Array For Displaying List
  RecordList: Customerm[] = [];
  // Single Record for add/edit/view details
  Record: Customerm = new Customerm;


  TypeList: any[] = [];
  ClassList: any[] = [];
  StateList: any[] = [];
  CountryList: any[] = [];
  fStateList: any[] = [];

  // Acc Group , Acc Type
  AcGrpList: any[] = [];
  AcTypeList: any[] = [];


  



  constructor(
    private mainService: AddbookService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {


    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;

    this.InitLov();

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

    this.LoadCombo();

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  InitLov() {


  }



  LoadCombo() {

    this.ClassList = [{ "name": "Private" }, { "name": "Public" }];

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
        this.StateList = response.statelist;
        this.CountryList = response.countrylist;
        this.AcGrpList = response.acgroupm;
        this.AcTypeList = response.actypem;
        this.fStateList = response.fstatelist;
        this.List("NEW");
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
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

    this.canadd = true;
    this.bDocs = true;

    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;

    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    this.bDocs = false;
    if (this.mode == "EDIT" && this.menu_record.rights_docs)
      this.bDocs = true;

    this.canadd = this.menu_record.rights_add;


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
      branch_code: this.gs.globalVariables.branch_code
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

    this.Record = new Customerm();
    this.Record.cust_pkid = this.pkid;
    this.Record.cust_code = '';
    this.Record.cust_name = '';

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

  LoadData(_Record: Customerm) {
    this.Record = _Record;
    this.Record.AddressList = _Record.AddressList;
    this.Record.rec_mode = this.mode;

    this.InitLov();


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
    if (this.Record.cust_code.trim().length <= 0) {
      bret = false;
      sError = " | Code Cannot Be Blank";
    }
    if (this.Record.cust_name.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Name Cannot Be Blank";
    }

    if (this.addressComponent) {
      if (this.addressComponent.currentTab != 'LIST') {
        bret = false;
        sError += "\n\r | Save/Cancel Address Record";
      }
    }

    if (bret) {
      this.Record.cust_code = this.Record.cust_code.toUpperCase().replace(' ', '');
      this.Record.cust_name = this.Record.cust_name.toUpperCase().trim();
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.cust_pkid == this.Record.cust_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cust_code = this.Record.cust_code;
      REC.cust_name = this.Record.cust_name;
    }
  }


  OnBlur(field: string) {

  }

  Close() {
    this.gs.ClosePage('home');
  }


}
