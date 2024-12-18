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

  download_doc_type: string = 'INVOICE';
  ErrorMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  selectedRowIndex = 0;
  gstin_supplier: string = "";
  period: number = 2020;
  state_code: string = "";

  //searchstring = '';
  // reconcile_state_name: string = "KERALA";
  // reconcile_state_code: string = "32";
  // round_off: number = 5;

  bPrint = false;
  bDocs: boolean = false;
  bAdmin: boolean = false;
  bSave: boolean = false;
  bCompany: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  MonList: any[] = [];

  SearchData = {
    category: '',
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
    chk_pending: false,
    hide_ho_entries: this.gs.globalVariables.hide_ho_entries,
    download_doc_type: this.download_doc_type,
    reverse_charge: 'NO'
  };

  // Array For Displaying List
  // RecordListReco: Gstr2bDownload[] = [];
  //  Single Record for add/edit/view details
  Record: Gstr2bDownload = new Gstr2bDownload;


  constructor(
    private modalService: NgbModal,
    public mainService: GstReconRepService,
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
    this.mainService.init(this.menuid);
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {
    this.bCompany = false;
    this.bAdmin = false;
    this.bPrint = false;
    this.bSave = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.bCompany = this.menu_record.rights_company;
      this.bAdmin = this.menu_record.rights_admin;
      this.bPrint = this.menu_record.rights_print;
      if (this.menu_record.rights_add || this.menu_record.rights_edit)
        this.bSave = true;
    }
    this.initLov();
    this.LoadCombo();
    this.Init();
  }

  Init() {

  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "STATE") {
      this.mainService.state.gst_recon_state_code = _Record.code;
      this.mainService.state.gst_recon_state_name = _Record.name;
    }
    if (_Record.controlname == "STATE-AMENT") {
      this.mainService.state.gst_recon_ament_state_code = _Record.code;
      this.mainService.state.gst_recon_ament_state_name = _Record.name;
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
    if (this.gs.isBlank(this.mainService.state.gst_recon_state_name)) {
      alert("State Cannot be Blank");
      return;
    }
    if (+this.mainService.state.gst_recon_year <= 0) {
      alert("Invalid Year");
      return;
    } else if (+this.mainService.state.gst_recon_year < 100) {
      alert("YEAR FORMAT : - YYYY ");
      return;
    }
    if (+this.mainService.state.gst_recon_month <= 0 || +this.mainService.state.gst_recon_month > 12) {
      alert("Invalid Month");
      return;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.category = this.type;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.mainService.state.gst_recon_searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.state_code = this.mainService.state.gst_recon_state_code;
    this.SearchData.state_name = this.mainService.state.gst_recon_state_name;
    this.SearchData.round_off = this.mainService.state.gst_recon_round_off;
    this.SearchData.recon_year = +this.mainService.state.gst_recon_year;
    this.SearchData.recon_month = +this.mainService.state.gst_recon_month;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.SearchData.download_doc_type = this.download_doc_type;
    this.SearchData.reverse_charge = 'NO';
    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
        else {
          this.mainService.state.RecordListReco = response.list;
        }
      },
        error => {
          this.loading = false;
          this.mainService.state.RecordListReco = null;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.mainService.state.RecordListReco = null;
  }
  Close() {
    this.gs.ClosePage('home');
  }

  ShowHideRecord(_rec: Gstr2bDownload) {
    // _rec.row_displayed = !_rec.row_displayed;
  }

  OnBlur(field: string) {
    if (field == "searchstring") {
      this.mainService.state.gst_recon_searchstring = this.mainService.state.gst_recon_searchstring.toUpperCase();
      this.mainService.state.gst_recon_ament_searchstring = this.mainService.state.gst_recon_ament_searchstring.toUpperCase();
    }
  }

  ProcessGstReconcile() {

    if (this.gs.isBlank(this.mainService.state.gst_recon_state_name)) {
      alert("State Cannot be Blank");
      return;
    }

    if (!confirm("Do you want to Process Data - " + this.mainService.state.gst_recon_state_name + " - " + this.getMonth(this.mainService.state.gst_recon_month) + ", " + this.mainService.state.gst_recon_year)) {
      return;
    }

    this.loading = true;
    this.SearchData.category = this.type;
    this.SearchData.state_code = this.mainService.state.gst_recon_state_code;
    this.SearchData.state_name = this.mainService.state.gst_recon_state_name;
    this.SearchData.round_off = this.mainService.state.gst_recon_round_off;
    this.SearchData.recon_year = +this.mainService.state.gst_recon_year;
    this.SearchData.recon_month = +this.mainService.state.gst_recon_month;
    this.SearchData.download_doc_type = this.download_doc_type;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.reverse_charge = 'NO';
    this.ErrorMessage = '';
    this.mainService.ProcessGstReconcile(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        // alert('Process Completed')
        this.List('SCREEN');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  getMonth(_month: string) {
    let _mName = "";
    if (this.MonList != null) {
      var REC = this.MonList.find(rec => rec.id == _month);
      if (REC != null) {
        _mName = REC.name;
      }
    }
    return _mName;
  }

  showDetailList(gstrdet: any, _gstin_supplier: string, _period: number, _state_code: string) {
    if (_gstin_supplier == "TOTAL")
      return;
    this.gstin_supplier = _gstin_supplier;
    this.period = _period;
    this.state_code = _state_code;
    this.open(gstrdet);
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  UpdatePurchaseData() {

    if (this.gs.isBlank(this.mainService.state.gst_recon_state_name)) {
      alert("State Cannot be Blank");
      return;
    }

    if (+this.mainService.state.gst_recon_year <= 0) {
      alert("Invalid Year");
      return;
    } else if (+this.mainService.state.gst_recon_year < 100) {
      alert("YEAR FORMAT : - YYYY ");
      return;
    }
    if (+this.mainService.state.gst_recon_month <= 0 || +this.mainService.state.gst_recon_month > 12) {
      alert("Invalid Month");
      return;
    }

    if (!confirm("Do you want to Update Data - " + this.mainService.state.gst_recon_state_name + " - " + this.getMonth(this.mainService.state.gst_recon_month) + ", " + this.mainService.state.gst_recon_year)) {
      return;
    }


    let SearchData2 = {
      category: '',
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
      gst_only: true,
      print_new_format: true,
      user_code: '',
      state_name: '',
      state_code: '',
      round_off: 5,
      hide_ho_entries: this.gs.globalVariables.hide_ho_entries,
      recon_year: 0,
      recon_month: 0,
      download_doc_type: this.download_doc_type,
      reverse_charge: 'NO'
    };


    this.loading = true;
    this.pkid = this.gs.getGuid();
    SearchData2.pkid = this.pkid;
    SearchData2.category = this.type;
    SearchData2.report_folder = this.gs.globalVariables.report_folder;
    SearchData2.company_code = this.gs.globalVariables.comp_code;
    SearchData2.branch_code = "STATE-WISE";
    SearchData2.year_code = this.gs.globalVariables.year_code;
    SearchData2.searchstring = '';
    SearchData2.type = 'RECONCILE-EXP-DATA';
    SearchData2.from_date = '';
    SearchData2.to_date = '';
    SearchData2.format_type = 'PURCHASE';
    SearchData2.all = false;
    SearchData2.gst_only = true;
    SearchData2.print_new_format = false;
    SearchData2.user_code = this.gs.globalVariables.user_code;
    SearchData2.state_code = this.mainService.state.gst_recon_state_code;
    SearchData2.state_name = this.mainService.state.gst_recon_state_name;
    SearchData2.round_off = this.mainService.state.gst_recon_round_off;
    SearchData2.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    SearchData2.recon_year = +this.mainService.state.gst_recon_year;
    SearchData2.recon_month = +this.mainService.state.gst_recon_month;
    SearchData2.download_doc_type = this.download_doc_type;
    SearchData2.reverse_charge = 'NO';
    this.ErrorMessage = '';
    this.mainService.UpdatePurchaseData(SearchData2)
      .subscribe(response => {
        this.loading = false;
        // alert(response.retmsg)
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  AmendmentList(_type: string) {
    if (this.gs.isBlank(this.mainService.state.gst_recon_state_name)) {
      alert("State Cannot be Blank");
      return;
    }
    if (+this.mainService.state.gst_recon_ament_year <= 0) {
      alert("Invalid Year");
      return;
    } else if (+this.mainService.state.gst_recon_ament_year < 100) {
      alert("YEAR FORMAT : - YYYY ");
      return;
    }
    if (+this.mainService.state.gst_recon_ament_month <= 0 || +this.mainService.state.gst_recon_ament_month > 12) {
      alert("Invalid Month");
      return;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.category = this.type;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.mainService.state.gst_recon_ament_searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.state_code = this.mainService.state.gst_recon_ament_state_code;
    this.SearchData.state_name = this.mainService.state.gst_recon_ament_state_name;
    this.SearchData.recon_year = +this.mainService.state.gst_recon_ament_year;
    this.SearchData.recon_month = +this.mainService.state.gst_recon_ament_month;
    this.ErrorMessage = '';
    this.mainService.AmendmentList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
        else {
          this.mainService.state.RecordListAment = response.list;
        }
      },
        error => {
          this.loading = false;
          this.mainService.state.RecordListAment = null;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
}
