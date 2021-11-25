
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { PreAlertReport } from '../models/prealertreport';

import { AirPreAlertReportService} from '../services/airprealertreport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-airprealert',
  templateUrl: './airprealert.component.html',
  providers: [AirPreAlertReportService]
})

export class AirPreAlertComponent {
  // Local Variables 
  title = 'AirPreAlert';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  searchmawb_no = '';
  selectedRowIndex = 0;


  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  types = '';
  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchmawb_no: '',
    types:''
  };

  EXPRECORD: any;
  EXPREC: any = { id: '', code: '', name: '' };
  // Array For Displaying List
  RecordList: PreAlertReport[] = [];
  // Single Record for add/edit/view details
  Record: PreAlertReport = new PreAlertReport;

  constructor(
    private mainService: AirPreAlertReportService,
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
    this.types = "PRE-ALERT";
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.initLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {
    //if (caption == '' || caption == 'SHIPPER')
    //  this.EXPRECORD = {
    //    controlname: 'SHIPPER', type: 'CUSTOMER', displaycolumn: 'NAME',
    //    parentid: '', id: this.EXPREC.id, code: this.EXPREC.code, name: this.EXPREC.name
    //  };
  }

  LovSelected(_Record: SearchTable) {


  }
  LoadCombo() {
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
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
    if (this.searchmawb_no.trim().length <= 0) {
      this.ErrorMessage = 'MAWB-NO Cannot Be Blank';
      return;
    }
    if (this.types.trim().length <= 0) {
      this.ErrorMessage = 'TYPE Cannot Be Blank';
      return;
    }
    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchmawb_no = this.searchmawb_no.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.types = this.types.toUpperCase();

    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
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
    if (field == 'types') {
      this.RecordList = null;

    }
  }



  OnBlur(field: string) {
    switch (field) {
      case 'searchcontainer':
        {
          this.searchmawb_no = this.searchmawb_no.toUpperCase().trim();
          break;
        }
    }
  }
}
