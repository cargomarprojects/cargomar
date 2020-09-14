import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { CostPending } from '../models/costpending';
import { RepService } from '../services/report.service';


@Component({
  selector: 'app-costpending',
  templateUrl: './costpending.component.html',
  providers: [RepService]
})

export class CostPendingComponent {
  title = 'CostPending Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";
  mode = '';
  pkid = '';

  branch_code: string = '';
  sort_colname: string = 'mbl.rec_created_date';
  type_date: string = '';
  from_date: string = '';
  to_date: string = '';
  category: string = 'MBL-SE';

  bCompany = false;
  bAdmin = false;
  disableSave = true;
  loading = false;
  all: boolean = false;
  currentTab = 'LIST';
  searchstring = '';

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    type_date: '',
    category: 'MBL-SE',
    sort_colname: '',
    all: false,
    user_code:''
  };

  SortList: any[] = [];
  // Array For Displaying List
  RecordList: CostPending[] = [];
  // Single Record for add/edit/view details
  Record: CostPending = new CostPending;

  BRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: RepService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
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
    this.bCompany = false;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.initLov();
    this.LoadCombo();
    this.Init();
  }

  Init() {
    this.branch_code = this.gs.globalVariables.branch_code;
    this.category = "MBL-SE";
    this.sort_colname = "mbl.rec_created_date";
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {
    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
    }

  }
  LoadCombo() {

    this.SortList = [
      { "colheadername": "CREATED", "colname": "mbl.rec_created_date" },
      { "colheadername": "AGENT", "colname": "agent.cust_name" },
      { "colheadername": "POSTED", "colname": "cost_jv_posted" },
      { "colheadername": "NO COSTING", "colname": "mbl.hbl_nocosting" },
      { "colheadername": "COST-DATE", "colname": "cost_date" },
      { "colheadername": "SENT-ON", "colname": "mbl.hbl_folder_sent_date" }
    ];
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = "";
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
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

    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    if (this.branch_code.trim().length <= 0) {
      this.ErrorMessage = "Branch Code Cannot Be Blank";
      return;
    }
    if (_type == "SCREEN" && this.all == true) {
      this.ErrorMessage = "Cannot Process Report With All Option";
      return;
    }
    if (_type == "MAIL") {
      if (!confirm("Do you want to Sent Pending List")) {
        return;
      }
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.type_date = this.type_date;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.category = this.category;
    this.SearchData.sort_colname = this.sort_colname;
    this.SearchData.all = this.all;
    this.SearchData.user_code = this.gs.globalVariables.user_code;

    this.ErrorMessage = '';
    this.mainService.PendingList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'MAIL') {
          if (response.msg.length > 0) {
            alert(response.msg);
          }
        }
        else {
          this.RecordList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  Close() {
    this.gs.ClosePage('home');
  }

  OnChange(field: string) {
    this.RecordList = null;
  }

  UpdateNoCosting(event: any) {
    if (event.selected) {
      this.SearchRecord('nocosting', event.id, "Y");
    } else {
      this.SearchRecord('nocosting', event.id, "N");
    }
  }

  //UpdateNoCosting(id: string, _refno: string) {
  //  let strmsg: string = "";
  //  strmsg = "NO COSTING Y/N \n\n FOLDER# : " + _refno;
  //  if (confirm(strmsg)) {
  //    this.SearchRecord('nocosting', id, "Y");
  //  } else {
  //    this.SearchRecord('nocosting', id, "N");
  //  }
  //}

  SearchRecord(controlname: string, controlid: string, controlyn: string) {
    this.InfoMessage = '';

    if (controlid.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      pkid: controlid,
      costyn: controlyn,
      table: 'nocosting'
    };
    if (controlname == 'nocosting') {
      SearchData.pkid = controlid;
      SearchData.costyn = controlyn;
      SearchData.table = 'nocosting';
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        if (response.nocosting.length > 0) {

          //var REC = this.RecordList.find(rec => rec.mbl_pkid == controlid)
          //if (REC != null) {
          //  REC.mbl_nocosting = response.nocosting;
          //}
          for (let rec of this.RecordList.filter(rec => rec.mbl_pkid == controlid)) {
            rec.mbl_nocosting = response.nocosting;
            rec.cost_date = response.nocostingdate;
          }
          this.InfoMessage = "Save Complete";
        }
      },
        error => {
          this.loading = false;
          this.InfoMessage = this.gs.getError(error);
        });
  }
}

