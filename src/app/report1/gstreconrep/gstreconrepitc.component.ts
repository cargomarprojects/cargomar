import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gstreconrepitc',
  templateUrl: './gstreconrepitc.component.html'
})

export class GstReconRepItcComponent {
  title = 'GST Reconcile Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() bPrint: boolean = false;
  @Input() bDocs: boolean = false;
  @Input() bAdmin: boolean = false;
  @Input() bSave: boolean = false;

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  selectedRowIndex = 0;
  // recon_year = 0;
  // recon_month = 0;
  gstin_supplier: string = "";
  period_id: string = "";
  claim_period: string = "";

  MonList: any[] = [];

  branch_code: string = '';
  // format_type: string = '';
  from_date: string = '';
  to_date: string = '';
  searchstring = '';
  display_format_type: string = '';
  reconcile_state_name: string = "KERALA";
  reconcile_state_code: string = "32";
  round_off: number = 5;
  chk_pending: boolean = true;
  // claim_status: string = 'ITC AVAILED';

  bCompany = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  chkallselected: boolean = false;
  selectdeselect: boolean = false;

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
  // RecordListItc: Gstr2bDownload[] = [];
  //  Single Record for add/edit/view details
  Record: Gstr2bDownload = new Gstr2bDownload;

  constructor(
    public modalService: NgbModal,
    private mainService: GstReconRepService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {


  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.Init();
  }


  Init() {
    this.mainService.InitList();

    this.branch_code = this.gs.globalVariables.branch_code;
    this.display_format_type = this.gs.defaultValues.gst_recon_itc_status;

    this.MonList = [{ "id": "01", "name": "JANUARY" }, { "id": "02", "name": "FEBRUARY" }, { "id": "03", "name": "MARCH" }
      , { "id": "04", "name": "APRIL" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUNE" }
      , { "id": "07", "name": "JULY" }, { "id": "08", "name": "AUGUST" }, { "id": "09", "name": "SEPTEMBER" }
      , { "id": "10", "name": "OCTOBER" }, { "id": "11", "name": "NOVEMBER" }, { "id": "12", "name": "DECEMBER" }];

  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "STATE") {
      this.gs.defaultValues.gst_recon_itc_state_code = _Record.code;
      this.gs.defaultValues.gst_recon_itc_state_name = _Record.name;
    }
  }
  LoadCombo() {

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

  // // Query List Data
  List(_type: string) {
    if (this.gs.isBlank(this.reconcile_state_name)) {
      alert("State Cannot be Blank");
      return;
    }
    if (+this.gs.defaultValues.gst_recon_itc_year <= 0) {
      alert("Invalid Year");
      return;
    } else if (+this.gs.defaultValues.gst_recon_itc_year < 100) {
      alert("YEAR FORMAT : - YYYY ");
      return;
    }
    if (+this.gs.defaultValues.gst_recon_itc_month <= 0 || +this.gs.defaultValues.gst_recon_itc_month > 12) {
      alert("Invalid Month");
      return;
    }

    this.display_format_type = this.gs.defaultValues.gst_recon_itc_status;
    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.format_type = this.gs.defaultValues.gst_recon_itc_status;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.state_code = this.gs.defaultValues.gst_recon_itc_state_code;
    this.SearchData.state_name = this.gs.defaultValues.gst_recon_itc_state_name;
    this.SearchData.round_off = this.round_off;
    this.SearchData.recon_year = +this.gs.defaultValues.gst_recon_itc_year;
    this.SearchData.recon_month = +this.gs.defaultValues.gst_recon_itc_month;
    this.ErrorMessage = '';
    this.mainService.ItcList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.chkallselected = false;
        this.selectdeselect = false;
        this.claim_period = response.claimperiod;
        if (_type == 'EXCEL') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
        else {
          this.mainService.RecordListItc = response.list;
        }
      },
        error => {
          this.loading = false;
          this.mainService.RecordListItc = null;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.mainService.RecordListItc = null;
  }
  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    if (field == "searchstring")
      this.searchstring = this.searchstring.toUpperCase();
  }

  OnBlurCell(field: string, _rec: Gstr2bDownload) {
    if (field == "reason")
      _rec.reason = _rec.reason.toUpperCase();
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.mainService.RecordListItc) {
      rec.rec_selected = this.selectdeselect;
    }
  }

  UpdateItcBluck() {

    let sPkids: string = "";//Main List
    let _Ctr: number = 0;
    let _status: string = "";
    for (let rec of this.mainService.RecordListItc) {
      if (rec.rec_selected) {
        _status = rec.reconcile_status;
        _Ctr++;
        if (sPkids != "")
          sPkids += ",";
        sPkids += rec.pkid;
      }
    }

    if (this.gs.isBlank(sPkids)) {
      alert('No Records selected');
      return;
    }

    // if (_status == "MATCHED" || _status == "ALMOST MATCHED" || _status == "MISMATCHED (GST AMOUNT)" || _status == "MISMATCHED (PERIOD)") {
    //     if (this.RecordListItc.length != _Ctr) {
    //         alert('Please select all Records');
    //         return;
    //     }
    // }

    if (!confirm("Update Claim Status")) {
      return;
    }

    let SearchData2 = {
      pkid: sPkids,
      claim_status: this.gs.defaultValues.gst_recon_itc_claim_status,
      claim_period: this.claim_period,
      save_remarks: false
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.UpdateItcClaim(SearchData2)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {
          let pkidsArray = sPkids.split(',');
          for (let i = 0; i < pkidsArray.length; i++) {
            for (let rec of this.mainService.RecordListItc.filter(rec => rec.pkid == pkidsArray[i])) {
              rec.claim_status = this.gs.defaultValues.gst_recon_itc_claim_status;
            }
          }
        }
        // alert('Save Completed')
        // this.BranchList = response.branchlist;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  UpdateItcRowWise(_id: string, _status: string, _remarks) {
    let SearchData2 = {
      pkid: _id,
      claim_status: _status,
      claim_period: this.claim_period,
      remarks: _remarks,
      save_remarks: true
    };
    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.UpdateItcClaim(SearchData2)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {
          alert('Save Complete');
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
}
