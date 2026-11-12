
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Egm } from '../models/egm';
import { EgmService } from '../services/egm.service';
// import { RepService } from '../services/report.service';

@Component({
  selector: 'app-egm',
  templateUrl: './egm.component.html',
  providers: [EgmService]
})

export class EgmComponent {
  title = 'Egm Report'
  
  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  // selectedRowIndex = 0;
  
  // ErrorMessage = "";
  mode = '';
  pkid = '';
  rec_category: string = "";
  // branch_name: string;
  // branch_code: string;
  job_type: string;

  bExcel = false;
  disableSave = true;
  bCompany = false;
  loading = false;

  // currentTab = 'LIST';
  // searchstring = '';

  SearchData = {
    type: '',
    rec_category: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    branch_name: '',
    year_code: '',
    searchstring: '',
    job_type: ''

  };

  // Array For Displaying List
  RecordList: Egm[] = [];
  // Single Record for add/edit/view details
  Record: Egm = new Egm;

  constructor(
    public ms: EgmService,
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

        this.rec_category = this.type;

        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.ms.init(this.menuid, this.type);
  }

  InitComponent() {
    this.bExcel = false;
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
    }
    // this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    
    // this.job_type = "ALL";
    // this.RecordList = null;
    // this.branch_code = this.gs.globalVariables.branch_code;
    // this.branch_name = this.gs.globalVariables.branch_name;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.restoreRowPosition();
    }, 100);
  }

  restoreRowPosition() {
    const row = document.getElementById('row-' + this.ms.state.selectedRowIndex);
    if (row) {
      row.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }
  }

  initLov(caption: string = '') {
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
  }
  LoadCombo() {
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ms.state.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.ms.state.currentTab = 'LIST';
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

    this.ms.state.ErrorMessage = '';
    if (this.ms.state.searchstring.trim().length <= 0) {
      this.ms.state.RecordList = [];
      this.ms.state.ErrorMessage = "Container Cannot Be Blank";
      return;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.branch_name = this.gs.globalVariables.branch_name;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.ms.state.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.job_type = this.job_type;
    this.ms.state.selectedRowIndex = 0;
    this.restoreRowPosition()
    this.ms.state.ErrorMessage = '';
    this.ms.EgmList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
        }
      },
      error => {
        this.loading = false;
        this.ms.state.RecordList = [];
        this.ms.state.ErrorMessage = this.gs.getError(error);
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  Close() {
    this.gs.ClosePage('home');
  }

}
