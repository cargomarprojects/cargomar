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
  @Input() bCompany: boolean = false;

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  selectedRowIndex = 0;

  gstin_supplier: string = "";
  period_id: string = "";
  // claim_period: string = "";

  MonList: any[] = [];

  // searchstring = '';
  // reconcile_state_name: string = "KERALA";
  // reconcile_state_code: string = "32";
  // round_off: number = 5;
  // chk_notclaimed: boolean = true;
  // claim_status: string = 'ITC AVAILED';


  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  chkallselected: boolean = false;
  selectdeselect: boolean = false;

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
    chk_notclaimed: true,
    hide_ho_entries: this.gs.globalVariables.hide_ho_entries
  };

  // Array For Displaying List
  // RecordListItc: Gstr2bDownload[] = [];
  //  Single Record for add/edit/view details
  Record: Gstr2bDownload = new Gstr2bDownload;

  constructor(
    private modalService: NgbModal,
    public mainService: GstReconRepService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {


  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.Init();
  }


  Init() {
    this.mainService.init(this.menuid);
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
      this.mainService.state.gst_recon_itc_state_code = _Record.code;
      this.mainService.state.gst_recon_itc_state_name = _Record.name;
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
    if (this.gs.isBlank(this.mainService.state.gst_recon_itc_state_name)) {
      alert("State Cannot be Blank");
      return;
    }
    if (+this.mainService.state.gst_recon_itc_year <= 0) {
      alert("Invalid Year");
      return;
    } else if (+this.mainService.state.gst_recon_itc_year < 100) {
      alert("YEAR FORMAT : - YYYY ");
      return;
    }
    if (+this.mainService.state.gst_recon_itc_month <= 0 || +this.mainService.state.gst_recon_itc_month > 12) {
      alert("Invalid Month");
      return;
    }

    this.mainService.state.gst_recon_itc_list_state_code = this.mainService.state.gst_recon_itc_state_code;
    this.mainService.state.gst_recon_itc_list_state_name = this.mainService.state.gst_recon_itc_state_name;
    this.mainService.state.gst_recon_itc_list_year = this.mainService.state.gst_recon_itc_year;
    this.mainService.state.gst_recon_itc_list_month = this.mainService.state.gst_recon_itc_month;

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.category = this.type;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.mainService.state.gst_recon_itc_searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.format_type = this.mainService.state.gst_recon_itc_status;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.state_code = this.mainService.state.gst_recon_itc_list_state_code;
    this.SearchData.state_name = this.mainService.state.gst_recon_itc_list_state_name;
    this.SearchData.recon_year = +this.mainService.state.gst_recon_itc_list_year;
    this.SearchData.recon_month = +this.mainService.state.gst_recon_itc_list_month;
    this.SearchData.chk_notclaimed = this.mainService.state.gst_recon_itc_chk_notclaimed;
    this.ErrorMessage = '';
    this.mainService.ItcList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.chkallselected = false;
        this.selectdeselect = false;
        this.mainService.state.gst_recon_itc_claim_period = response.claimperiod;
        if (_type == 'EXCEL') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
        else {
          this.mainService.state.RecordListItc = response.list;
        }
      },
        error => {
          this.loading = false;
          this.mainService.state.RecordListItc = null;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.mainService.state.RecordListItc = null;
  }
  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    if (field == "searchstring")
      this.mainService.state.gst_recon_itc_searchstring = this.mainService.state.gst_recon_itc_searchstring.toUpperCase();
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
    for (let rec of this.mainService.state.RecordListItc) {
      rec.rec_selected = this.selectdeselect;
    }
  }

  UpdateItcBluck() {

    let sPkids: string = "";//Main List
    let _Ctr: number = 0;
    let _BatchCtr: number = 0;
    for (let rec of this.mainService.state.RecordListItc) {
      if (rec.rec_selected) {
        _Ctr++;
      }
      if (_Ctr > 0)
        break;
    }

    if (_Ctr == 0) {
      alert('No Records selected');
      return;
    }

    if (!confirm("Update Claim Status")) {
      return;
    }


    sPkids = ""; _Ctr = 0; _BatchCtr = 0;
    for (let rec of this.mainService.state.RecordListItc) {
      if (rec.rec_selected) {
        _Ctr++;
        if (sPkids != "")
          sPkids += ",";
        sPkids += rec.pkid;
      }
      if (_Ctr >= 250) {
        _BatchCtr++;
        this.UpdateItcbatchwise(sPkids, _BatchCtr, _Ctr);
        sPkids = ""; _Ctr = 0;
      }
    }

    if (sPkids != "") {
      _BatchCtr++;
      this.UpdateItcbatchwise(sPkids, _BatchCtr, _Ctr);
    }

  }

  UpdateItcbatchwise(_ids: string, _batchNo: number, _totRecsUpdt: number) {
    let SearchData2 = {
      category: this.type,
      pkid: _ids,
      claim_status: this.mainService.state.gst_recon_itc_claim_status,
      claim_period: this.mainService.state.gst_recon_itc_claim_period,
      recon_year: +this.mainService.state.gst_recon_itc_list_year,
      recon_month: +this.mainService.state.gst_recon_itc_list_month,
      save_remarks: false,
      user_code: this.gs.globalVariables.user_code
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.UpdateItcClaim(SearchData2)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {
          let pkidsArray = _ids.split(',');
          for (let i = 0; i < pkidsArray.length; i++) {
            for (let rec of this.mainService.state.RecordListItc.filter(rec => rec.pkid == pkidsArray[i])) {
              rec.claim_status = this.mainService.state.gst_recon_itc_claim_status;
              rec.row_color2 = rec.claim_status == "PENDING" ? "black" : rec.row_color;
              rec.display_claimed_period = response.retperiod;
              rec.claim_created_date = this.gs.ConvertDate2DisplayFormat(this.gs.defaultValues.today);
              rec.claim_created_by = this.gs.globalVariables.user_code;
            }
          }
        }
        console.log('Batch Competed : ', _batchNo);
        console.log('Records Updated : ', _totRecsUpdt);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  UpdateItcRowWise(_id: string, _status: string, _remarks) {
    let SearchData2 = {
      category: this.type,
      pkid: _id,
      claim_status: _status,
      claim_period: this.mainService.state.gst_recon_itc_claim_period,
      remarks: _remarks,
      recon_year: +this.mainService.state.gst_recon_itc_list_year,
      recon_month: +this.mainService.state.gst_recon_itc_list_month,
      save_remarks: true,
      user_code: this.gs.globalVariables.user_code
    };
    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.UpdateItcClaim(SearchData2)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {

          for (let rec2 of this.mainService.state.RecordListItc.filter(rec2 => rec2.pkid == _id)) {
            rec2.row_color2 = rec2.claim_status == "PENDING" ? "black" : rec2.row_color;
            rec2.display_claimed_period = response.retperiod;
            rec2.claim_created_date = this.gs.ConvertDate2DisplayFormat(this.gs.defaultValues.today);
            rec2.claim_created_by = this.gs.globalVariables.user_code;
          }
          // alert('Save Complete');
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  showInvoice(_rec: Gstr2bDownload) {
    if (_rec.pkid == null)
      return;
    if (_rec.download_source != 'PURCHASE')
      return;

    _rec.rec_displayed = !_rec.rec_displayed;

  }
}
