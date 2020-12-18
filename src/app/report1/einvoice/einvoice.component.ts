import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { GstReport } from '../models/gstreport';
import { Companym } from '../../core/models/company';

import { RepService } from '../services/report.service';

@Component({
  selector: 'app-einvoice',
  templateUrl: './einvoice.component.html',
  providers: [RepService]
})

export class EinvoiceComponent {
  title = 'E-Invoice'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  file_name : File;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  branch_code: string = '';
  format_type: string = '';
  from_date: string = '';
  to_date: string = '';
  searchstring = '';
  display_format_type: string = '';

  bCompany = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  BranchList: Companym[] = [];
  
  invoice: boolean = false;
  exportinvoice: boolean = false;
  dn: boolean = false;
  cn: boolean = false;

  binvoice: boolean = false;
  bexportinvoice: boolean = false;
  bdn: boolean = false;
  bcn: boolean = false;

  gst_only: boolean = true;

  controlname = '';
  tabletype = '';
  subtype = '';
  displaydata = this.gs.globalVariables.branch_code;
  where = "";

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    user_code : '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    format_type: '',
    all: false,
    gst_only: true,
    invoice : false,
    exportinvoice : false,
    dn : false,
    cn : false,
    page_count : 0,
    page_current : 0,
    page_rows : 0,
    page_rowcount : 0,
  
  };

  // Array For Displaying List
  RecordList: GstReport[] = [];
  //  Single Record for add/edit/view details
  Record: GstReport = new GstReport;

  BRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: RepService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 

    this.page_count = 0;
    this.page_rows = 20;
    this.page_current = 0;


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
    var apr = '';
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);

    if (this.gs.globalVariables.user_code == "ADMIN"){
      this.binvoice =true; this.bexportinvoice=true; this.bdn=true; this.bcn=true;
    }

    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      apr = this.menu_record.rights_approval;
      
      if (this.menu_record.rights_admin){
        this.binvoice =true; this.bexportinvoice=true; this.bdn=true; this.bcn=true;
      }
      else  {
        this.binvoice =false; this.bexportinvoice =false;this.bdn =false;this.bcn=false;
      }

      if (apr.toString().indexOf('{IN}') >=0 )
        this.binvoice =true;
      if (apr.toString().indexOf('{IN-ES}') >=0 )
        this.bexportinvoice =true;
      if (apr.toString().indexOf('{DN}') >= 0)
        this.bdn =true;
      if (apr.toString().indexOf('{CN}') >= 0)
        this.bcn =true;
    }

    this.initLov();
    this.Init();
  }

  Init() {
    this.branch_code = this.gs.globalVariables.branch_code;
    this.format_type = "GSTR1";
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.display_format_type = this.format_type;
  }

  initLov(caption: string = '') {

    this.BRRECORD = new SearchTable(); //OLD SINGLE select
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;

    this.controlname = "BRANCH"; //New multi select
    this.tabletype = "BRANCH";
    this.subtype = "";
    this.displaydata = this.gs.globalVariables.branch_code;
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
    }
  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
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

  // // Query List Data
  List(_type: string) {

    this.ErrorMessage = '';
    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = "From Date Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }
    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = "To Date Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }

    if (this.branch_code.trim().length <= 0) {
      this.ErrorMessage = "Branch Code Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }


    this.display_format_type = this.format_type;

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.format_type = this.format_type;
    this.SearchData.invoice = this.invoice;
    this.SearchData.exportinvoice = this.exportinvoice;
    this.SearchData.dn = this.dn;
    this.SearchData.cn = this.cn;

    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows =this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    this.ErrorMessage = '';
    this.mainService.EInvoiceReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'GENERATE')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);          
        else if (_type == 'GSP') {
          alert(response.status);
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);     
        }
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
          alert( this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  getFileDetails(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.file_name = e.target.files[i];
    }
  }


  upload(){
    
    if ( this.file_name == null) {
      alert('No File Selected');
      return;
    }

    let frmData: FormData = new FormData();
    frmData.append("report_folder", this.gs.globalVariables.report_folder);
    frmData.append("comp_code", this.gs.globalVariables.comp_code );
    frmData.append("user_code", this.gs.globalVariables.user_code );
    frmData.append("fileUpload", this.file_name);
    this.mainService.EInvoiceUpload(frmData).subscribe(
      response => {
        alert( response.msg);
      },
      error => {
        alert(this.gs.getError(error));
      }
    );


  }


  OnChange(field: string) {
    this.RecordList = null;
  }
  Close() {
    this.gs.ClosePage('home');
  }

  SelectBank(_rec: Companym) {
    // _rec.comp_checked = true;
  }

}
