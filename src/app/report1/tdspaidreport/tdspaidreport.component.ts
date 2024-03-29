import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { TdsPaidReport } from '../models/tdspaidreport';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-tdspaidreport',
  templateUrl: './tdspaidreport.component.html',
  providers: [RepService]
})

export class TdspaidReportComponent {
  title = 'Tds Paid Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  selectedRowIndex = 0;
  ErrorMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  branch_code: string = '';
  format_type: string = '';
  from_date: string = '';
  to_date: string = '';
  searchstring = '';
  display_format_type: string = '';
  tan_code: string = '';
  bAdmin = false;
  bCompany = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  all: boolean = false;

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
    all: false
  };

  // Array For Displaying List
  RecordList: TdsPaidReport[] = [];
  //  Single Record for add/edit/view details
  Record: TdsPaidReport = new TdsPaidReport;
  BRRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
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
    this.format_type = "TDS-PAID-DETAILS";
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.display_format_type = this.format_type;
  }

  // // Destroy Will be called when this component is closed
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
    // if (this.from_date.trim().length <= 0) {
    //   this.ErrorMessage = "From Date Cannot Be Blank";
    //   return;
    // }
    // if (this.to_date.trim().length <= 0) {
    //   this.ErrorMessage = "To Date Cannot Be Blank";
    //   return;
    // }

    // if (this.branch_code.trim().length <= 0) {
    //   this.ErrorMessage = "Branch Code Cannot Be Blank";
    //   return;
    // }

    // if (this.format_type == "FORM 3B" || this.format_type == "FORM 3B-RATE WISE") {
    //   if (this.all == true) {
    //     this.ErrorMessage = "Cannot Process Report With All Option";
    //     return;
    //   }
    // }




    // if (_type == "GSTR1") {

    //   if (this.format_type != "GSTR1") {
    //     this.ErrorMessage = "Please Select  GSTR1 Type and Continue........";
    //     return;
    //   }
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
    // this.SearchData.from_date = this.from_date;
    // this.SearchData.to_date = this.to_date;
    this.SearchData.format_type = this.format_type;
    // this.SearchData.all = this.all;

    this.ErrorMessage = '';
    this.mainService.TdspaidReport(this.SearchData)
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
  OnBlur(field: string) {
    this.searchstring = this.searchstring.toUpperCase();
  }
  Close() {
    this.gs.ClosePage('home');
  }
  showDetails(rec: TdsPaidReport) {
    if (rec.row_type == "TOTAL")
      return;

    rec.displayed = !rec.displayed;
    // if (rec.tan_id !== '') {
    //   rec.displayed = !rec.displayed;
    // }

  }

  showDetailReport(rec: TdsPaidReport, tdscertpaid: any) {
    
    if (rec == null)
      return;
    this.tan_code = rec.tan_code;
    this.open(tdscertpaid);
  }
  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
}
