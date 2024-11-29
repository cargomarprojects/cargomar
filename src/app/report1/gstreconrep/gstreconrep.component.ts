import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gstreconrep',
  templateUrl: './gstreconrep.component.html'
})

export class GstReconRepComponent {
  title = 'GST Reconcile Report'

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  selectedRowIndex = 0;
  recon_year = 0;
  recon_month = 0;
  gstin_supplier: string = "";
  period: number = 2020;
  state_code: string = "";

  branch_code: string = '';
  format_type: string = '';
  from_date: string = '';
  to_date: string = '';
  searchstring = '';
  display_format_type: string = '';
  reconcile_state_name: string = "KERALA";
  reconcile_state_code: string = "32";
  round_off: number = 5;
  chk_pending: boolean = true;

  bCompany = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  MonList: any[] = [];

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
    user_code: '',
    state_name: '',
    state_code: '',
    round_off: 5,
    recon_year: 0,
    recon_month: 0,
    chk_pending: this.chk_pending,
    hide_ho_entries: this.gs.globalVariables.hide_ho_entries
  };

  // Array For Displaying List
  RecordList: Gstr2bDownload[] = [];
  //  Single Record for add/edit/view details
  Record: Gstr2bDownload = new Gstr2bDownload;

  constructor(
    private modalService: NgbModal,
    private mainService: GstReconRepService,
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
    this.format_type = "RECONCILE-GSTR2B";
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.display_format_type = this.format_type;

    // if (this.gs.defaultValues.today.trim() != "") {
    //   var tempdt = this.gs.defaultValues.today.split('-');
    //   this.recon_year = +tempdt[0];
    //   this.recon_month = +tempdt[1];
    // }
  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "STATE") {
      this.reconcile_state_code = _Record.code;
      this.reconcile_state_name = _Record.name;
    }
  }
  LoadCombo() {
    this.MonList = [{ "id": "01", "name": "JANUARY" }, { "id": "02", "name": "FEBRUARY" }, { "id": "03", "name": "MARCH" }
      , { "id": "04", "name": "APRIL" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUNE" }
      , { "id": "07", "name": "JULY" }, { "id": "08", "name": "AUGUST" }, { "id": "09", "name": "SEPTEMBER" }
      , { "id": "10", "name": "OCTOBER" }, { "id": "11", "name": "NOVEMBER" }, { "id": "12", "name": "DECEMBER" }];

    // this.loading = true;
    // let SearchData = {
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code
    // };
    // SearchData.comp_code = this.gs.globalVariables.comp_code;
    // SearchData.branch_code = this.gs.globalVariables.branch_code;
    // this.ErrorMessage = '';
    // this.mainService.LoadDefault(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     // this.BranchList = response.branchlist;
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


  // // Query List Data
  List(_type: string) {
    if (this.gs.isBlank(this.reconcile_state_name)) {
      alert("State Cannot be Blank");
      return;
    }
    if (+this.gs.defaultValues.gst_recon_year <= 0) {
      alert("Invalid Year");
      return;
    } else if (+this.gs.defaultValues.gst_recon_year < 100) {
      alert("YEAR FORMAT : - YYYY ");
      return;
    }
    if (+this.gs.defaultValues.gst_recon_month <= 0 || +this.gs.defaultValues.gst_recon_month > 12) {
      alert("Invalid Month");
      return;
    }

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
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.state_code = this.reconcile_state_code;
    this.SearchData.state_name = this.reconcile_state_name;
    this.SearchData.round_off = this.round_off;
    this.SearchData.recon_year = +this.gs.defaultValues.gst_recon_year;
    this.SearchData.recon_month = +this.gs.defaultValues.gst_recon_month;
    this.SearchData.chk_pending = this.chk_pending;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
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
  Close() {
    this.gs.ClosePage('home');
  }

  ShowHideRecord(_rec: Gstr2bDownload) {
    // _rec.row_displayed = !_rec.row_displayed;
  }

  OnBlur(field: string) {
    if (field == "searchstring")
      this.searchstring = this.searchstring.toUpperCase();
  }

  ProcessGstReconcile() {

    if (this.gs.isBlank(this.reconcile_state_name)) {
      alert("State Cannot be Blank");
      return;
    }

    // if (this.recon_year <= 0) {
    //   alert("Invalid Year");
    //   return;
    // } else if (this.recon_year < 100) {
    //   alert("YEAR FORMAT : - YYYY ");
    //   return;
    // }
    // if (this.recon_month <= 0 || this.recon_month > 12) {
    //   alert("Invalid Month");
    //   return;
    // }

    if (!confirm("Do you want to Process Data")) {
      return;
    }

    this.loading = true;
    this.SearchData.state_code = this.reconcile_state_code;
    this.SearchData.state_name = this.reconcile_state_name;
    this.SearchData.round_off = this.round_off;
    this.SearchData.recon_year = +this.gs.defaultValues.gst_recon_year;
    this.SearchData.recon_month = +this.gs.defaultValues.gst_recon_month;
    this.ErrorMessage = '';
    this.mainService.ProcessGstReconcile(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        alert('Process Completed')
        // this.BranchList = response.branchlist;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  showDetailList(gstrdet: any, _gstin_supplier: string, _period: number, _state_code: string) {
    this.gstin_supplier = _gstin_supplier;
    this.period = _period;
    this.state_code = _state_code;
    this.open(gstrdet);
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
}
