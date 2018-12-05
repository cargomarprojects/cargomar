import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { TaxPlan } from '../models/taxplan';
import { TaxplanService } from '../services/taxplan.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-taxplan',
  templateUrl: './taxplan.component.html',
  providers: [TaxplanService]
})
export class TaxPlanComponent  {
  // Local Variables 
  title = 'TaxPlan';

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

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: TaxPlan[] = [];
  // Single Record for add/edit/view details
  Record: TaxPlan = new TaxPlan;

  constructor(
    private mainService: TaxplanService,
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

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    
   
    this.List("NEW");
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
      });
  }


  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new TaxPlan();
    this.Record.tp_pkid = this.pkid;
    this.Record.tp_group_ctr = 0;
    this.Record.tp_ctr = 0;
    this.Record.tp_desc = '';
    this.Record.tp_limit = 0;
    this.Record.tp_editable = false;
    this.Record.tp_bold = false;
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

  LoadData(_Record: TaxPlan) {
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
    
    if (this.Record.tp_ctr <= 0) {
      bret = false;
      sError = "\n\r  Order Cannot Be Blank";
    }
    if (this.Record.tp_group_ctr <= 0) {
      bret = false;
      sError = "\n\r  Group Cannot Be Blank";
    }
    if (this.Record.tp_desc.trim().length <= 0) {
      bret = false;
      sError = "\n\r Description Cannot Be Blank";
    }
    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.tp_pkid == this.Record.tp_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.tp_bold = this.Record.tp_bold;
      REC.tp_ctr = this.Record.tp_ctr;
      REC.tp_desc = this.Record.tp_desc;
      REC.tp_editable = this.Record.tp_editable;
      REC.tp_group_ctr = this.Record.tp_group_ctr;
      REC.tp_limit = this.Record.tp_limit;
     
    }
  }


  OnBlur(field: string) {
    
    if (field == 'tp_desc') {
      this.Record.tp_desc = this.Record.tp_desc.toUpperCase();
    }
    
  }
  

  Close() {
    this.gs.ClosePage('home');
  }


}
