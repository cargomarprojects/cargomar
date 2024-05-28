import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { GenReportService } from '../services/genreport.service';
import { DateComponent } from '../../shared/date/date.component';

@Component({
  selector: 'app-genreport',
  templateUrl: './genreport.component.html',
  providers: [GenReportService]
})

export class GenReportComponent {
  title = 'General Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  modal: any;

  selectedRowIndex = 0;
  ErrorMessage = "";
  mode = '';
  pkid = '';
  radio_code: string = "";
  radio_desc: string = "";
  print_type: string = "";

  lbl_from_date: string = '';
  from_date: string = '';
  lbl_to_date: string = '';
  to_date: string = '';
  bExcel = false;
  disableSave = true;
  bCompany = false;
  bAdmin = false;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';
  bapprovalstatus = "";

  bAdditem1 = false;
  bAdditem2 = false;
  bAdditem3 = false;
  bAdditem4 = false;

  SearchData = {
    type: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    from_date: '',
    to_date: '',
    hide_ho_entries: this.gs.globalVariables.hide_ho_entries
  };

  // Array For Displaying List
  RecordList: any[] = [];
  //  RecordList = [{ "code": "{1}", "name": "1. BUSINESS PROMOTION EXPENSE", "id": 1, "type": "BUSINESS-PROMOTION-EXPENSE" }];

  constructor(
    private modalService: NgbModal,
    private mainService: GenReportService,
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
    this.bapprovalstatus = "";
    this.bExcel = false;
    this.bCompany = false;
    this.bAdmin = false;
    this.bAdditem1 = true;
    this.bAdditem2 = true;
    this.bAdditem3 = true;
    this.bAdditem4 = true;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
      this.bapprovalstatus = this.menu_record.rights_approval.toString().trim();
      if (this.bapprovalstatus.length > 0) {
        this.bAdditem1 = false;
        this.bAdditem2 = false;
        this.bAdditem3 = false;
        this.bAdditem4 = false;
        if (this.bapprovalstatus.indexOf('{1}') >= 0)
          this.bAdditem1 = true;
        if (this.bapprovalstatus.indexOf('{2}') >= 0)
          this.bAdditem2 = true;
        if (this.bapprovalstatus.indexOf('{3}') >= 0)
          this.bAdditem3 = true;
        if (this.bapprovalstatus.indexOf('{4}') >= 0)
          this.bAdditem4 = true;
      }
    }

    this.LoadCombo();
    this.Init();
    this.initLov();
  }

  Init() {
    this.lbl_from_date = "";
    if (this.radio_code == "{1}" || this.radio_code == "{3}" || this.radio_code == "{4}")
      this.lbl_from_date = "From Date";
    this.lbl_to_date = "";
    if (this.radio_code == "{1}" || this.radio_code == "{3}" || this.radio_code == "{4}")
      this.lbl_to_date = "To Date";

    if (this.lbl_from_date != "")
      this.from_date = this.gs.defaultValues.monthbegindate;
    if (this.lbl_to_date != "")
      this.to_date = this.gs.defaultValues.today;

    if (this.radio_code == "{1}" || this.radio_code == "{3}" || this.radio_code == "{4}")
      this.setPreWkDtMonday2Sunday();
  }

  setPreWkDtMonday2Sunday() {
    let dayOfWk: number = 0;

    var today = new Date();
    dayOfWk = today.getDay();
    var wkday = today.getDate() - today.getDay() + 1;
    var wkStart = new Date(today.setDate(wkday));

    this.to_date = wkStart.toISOString().slice(0, 10);
    if (dayOfWk == 1) {
      //if Monday will show previous week
      wkStart = new Date(new Date(wkStart).setDate(wkStart.getDate() - 7));
      var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
      this.from_date = wkStart.toISOString().slice(0, 10);
      this.to_date = wkEnd.toISOString().slice(0, 10);
    } else {
      this.from_date = wkStart.toISOString().slice(0, 10);
      this.to_date = this.gs.defaultValues.today;
    }
  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {

  }
  LoadCombo() {
    if (this.bAdditem1)
      this.RecordList.push({ "code": "{1}", "name": "1. BUSINESS PROMOTION EXPENSE", "id": 1, "type": "BUSINESS-PROMOTION-EXPENSE" });
    if (this.bAdditem2)
      this.RecordList.push({ "code": "{2}", "name": "2. CUSTOMS EXPENSES", "id": 2, "type": "CUSTOMS-EXPENSES" });
    if (this.bAdditem3)
      this.RecordList.push({ "code": "{3}", "name": "3. REBATE PAYABLE", "id": 3, "type": "REBATE-PAYABLE" });
    if (this.bAdditem4)
      this.RecordList.push({ "code": "{4}", "name": "4. TRAVELLING EXPENSE", "id": 4, "type": "TRAVELLING-EXPENSE" });

    for (let rec of this.RecordList) {
      this.radio_code = rec.code;
      this.radio_desc = rec.name;
      this.print_type = rec.type;
      break;
    }
  }

  cellChange(_rec: any) {
    this.radio_desc = _rec.name;
    this.print_type = _rec.type;
    this.Init();
  }

  PrintExcel() {

    if (this.print_type == "BUSINESS-PROMOTION-EXPENSE") {
      this.PrintBusinessPromotion();
    }
    else if (this.print_type == "REBATE-PAYABLE") {
      this.PrintRebate();
    } else if (this.print_type == "TRAVELLING-EXPENSE") {
      this.PrintTravellingExp();
    } else {
      alert('Option Not Available');
    }
  }

  PrintBusinessPromotion() {

    this.ErrorMessage = '';
    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = "From Date Cannot Be Blank";
      return;
    }
    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = "To Date Cannot Be Blank";
      return;
    }

    this.loading = true;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.type = this.print_type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.ErrorMessage = '';
    this.mainService.PrintBusinessPromotion(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  PrintRebate() {

    this.ErrorMessage = '';
    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = "From Date Cannot Be Blank";
      return;
    }
    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = "To Date Cannot Be Blank";
      return;
    }

    this.loading = true;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.type = this.print_type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.ErrorMessage = '';
    this.mainService.PrintRebate(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  PrintTravellingExp() {

    this.ErrorMessage = '';
    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = "From Date Cannot Be Blank";
      return;
    }
    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = "To Date Cannot Be Blank";
      return;
    }

    this.loading = true;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.type = this.print_type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.ErrorMessage = '';
    this.mainService.PrintTravellingExp(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
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

}
