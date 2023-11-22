import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { GstReport } from '../models/gstreport';
import { Companym } from '../../core/models/company';

import { RepService } from '../services/report.service';

@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  providers: [RepService]
})

export class GstComponent {
  title = 'GST Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

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
  all: boolean = false;
  gst_only: boolean = true;

  controlname = '';
  tabletype = '';
  subtype = '';
  displaydata = this.gs.globalVariables.branch_code;
  where = "";

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
    format_type: '',
    all: false,
    gst_only: true
  };

  SearchData2 = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    state_code :'',
    return_period : '',
    user_code : '',
    otp : ''
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
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
    }
    this.initLov();
    this.LoadCombo();
    this.Init();
  }

  Init() {
    this.branch_code = this.gs.globalVariables.branch_code;
    this.format_type = "GSTR1";
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.display_format_type = this.format_type;
  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
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
  LoadCombo() {

    // this.loading = true;
    // let SearchData = {
    //   type: 'type',
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code
    // };
    // SearchData.comp_code = this.gs.globalVariables.comp_code;
    // SearchData.branch_code = this.gs.globalVariables.branch_code;
    // this.ErrorMessage = '';
    // this.mainService.LoadDefault(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.BranchList = response.branchlist;
    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //     });

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

    if (this.format_type == "FORM 3B" || this.format_type == "FORM 3B-RATE WISE") {
      if (this.all == true) {
        this.ErrorMessage = "Cannot Process Report With All Option";
        alert(this.ErrorMessage);
        return;
      }
    }


    if (_type == "GSTR1" || _type == "NEW-GSTR1") {

      if (this.format_type != "GSTR1") {
        this.ErrorMessage = "Please Select  GSTR1 Type and Continue........";
        alert(this.ErrorMessage);
        return;
      }
    }

    // if (this.bCompany) {
    //   let Br_Codes: string = "";
    //   this.BranchList.forEach(Rec => {
    //     if (Rec.comp_checked) {
    //       if (Br_Codes.trim() != "")
    //         Br_Codes += ",";
    //       Br_Codes += Rec.comp_code.trim();
    //     }
    //   })
    //   if (Br_Codes.trim() == "") {
    //     this.ErrorMessage = "No branchs selected";
    //     alert(this.ErrorMessage);
    //     return;
    //   }
    //   this.branch_code = Br_Codes;
    // }

    this.display_format_type = this.format_type;

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.format_type = this.format_type;
    this.SearchData.all = this.all;
    this.SearchData.gst_only = this.gst_only;

    this.ErrorMessage = '';
    this.mainService.GstReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          if (_type == "GSTR1" || _type == "NEW-GSTR1")
            alert(response.generatemsg);
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
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


  // GSTR2B
  state_code = '32';
  state_name = 'KERALA';
  retn_period = '012021';
  otp = "";
  LovSelected2(_Record: SearchTable) {
    if (_Record.controlname == "STATE") {
      this.state_code = _Record.code;
      this.state_name = _Record.name;
    }
  }

  ProcessGstr2B(_type: string) {

    this.ErrorMessage = '';
    if (this.state_code.trim().length <= 0) {
      this.ErrorMessage = "State Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }
    if (this.retn_period.trim().length <= 0) {
      this.ErrorMessage = "Return Period Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }

    if (_type == "GSTR2B"){
      if (this.otp.trim().length <= 0) {
        this.ErrorMessage = "OTP Cannot Be Blank";
        alert(this.ErrorMessage);
        return;
      }
    }

    this.loading = true;
    this.SearchData2.pkid = this.gs.getGuid();
    this.SearchData2.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData2.company_code = this.gs.globalVariables.comp_code;
    this.SearchData2.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData2.year_code = this.gs.globalVariables.year_code;
    this.SearchData2.state_code = this.state_code;
    this.SearchData2.return_period = this.retn_period;
    this.SearchData2.searchstring = '';
    this.SearchData2.type = _type;
    this.SearchData2.user_code = this.gs.globalVariables.user_code;
    this.SearchData2.otp = this.otp;

    this.ErrorMessage = '';
    this.mainService.ProcessGSTRApi(this.SearchData2)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL') 
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'OTP' || _type == 'GSTR2B') {
          if ( response.status != "")
            alert(response.status);  
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert( this.ErrorMessage);
        });
  }




}
