
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { PreAlertReport } from '../models/prealertreport';

import { PreAlertReportService } from '../services/prealertreport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-prealert',
  templateUrl: './prealert.component.html',
  providers: [PreAlertReportService]
})

export class PreAlertComponent {
  // Local Variables 
  title = 'Pre Alert';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  // selectedRowIndex = 0;
  
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  // searchcontainer = '';


  sub: any;
  urlid: string;

  // ErrorMessage = "";
  mode = '';
  pkid = '';

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchcontainer: '',
    docattach:'N'
  };

  // EXPRECORD: any;
  // EXPREC: any = { id: '', code: '', name: '' };
  // // Array For Displaying List
  // RecordList: PreAlertReport[] = [];
  // Single Record for add/edit/view details
  Record: PreAlertReport = new PreAlertReport;

  constructor(
    public ms: PreAlertReportService,
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
    this.ms.init(this.menuid, this.type);
  }

  InitComponent() {

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
    this.ms.state.ErrorMessage = '';
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
    if (this.ms.state.searchcontainer.trim().length <= 0) {
      this.ms.state.ErrorMessage = 'Container Cannot Be Blank';
      alert(this.ms.state.ErrorMessage);
      return;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchcontainer = this.ms.state.searchcontainer.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.docattach = "N";

    this.ms.state.selectedRowIndex = 0;
    this.restoreRowPosition()

    this.ms.state.ErrorMessage = '';
    this.ms.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.ms.state.RecordList = response.list;
        }
      },
      error => {
        this.loading = false;
        this.ms.state.ErrorMessage = this.gs.getError(error);
        alert(this.ms.state.ErrorMessage);
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'searchcontainer':
        {
          this.ms.state.searchcontainer = this.ms.state.searchcontainer.toUpperCase().trim();
          break;
        }
    }
  }
}
