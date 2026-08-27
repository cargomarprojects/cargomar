import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';

@Component({
  selector: 'app-gstreconrepdet',
  templateUrl: './gstreconrepdet.component.html'
})

export class GstReconRepDetComponent {
  title = 'GST Reconcile Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() gstinsupplier: string = '';
  @Input() period: number = 2020;
  @Input() state_code: string = '';
  @Input() download_doc_type: string = '';
  @Input() reverse_charge: string = 'NO';
  @Input() bSaveRc: boolean = false;


  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  bpending: boolean = false;
  recon_rc_status: string = "ALL";
  recon_claim_status: string = "ITC AVAILED";
  list_rc_status: string = "";
  ErrorMessage = "";
  mode = '';
  pkid = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  // Array For Displaying List
  RecordList: Gstr2bDownload[] = [];
  //  Single Record for add/edit/view details
  Record: Gstr2bDownload = new Gstr2bDownload;

  constructor(
    public mainService: GstReconRepService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {


  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.List();
  }



  Init() {

  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {

  }
  List() {
    this.list_rc_status = this.recon_rc_status;
    this.loading = true;
    let SearchData = {
      category: this.type,
      gstin_supplier: this.gstinsupplier,
      period: this.period,
      state_code: this.state_code,
      download_doc_type: this.download_doc_type,
      reverse_charge: this.reverse_charge,
      bpending: this.recon_rc_status == 'PENDING' ? true : false,
      recon_rc_status: this.recon_rc_status
    };
    this.ErrorMessage = '';
    this.mainService.DetailList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }


  OnChange(field: string) {

  }
  Close() {
    this.gs.ClosePage('home');
  }

  showInvoice(_rec: Gstr2bDownload) {
    if (_rec.pkid == null)
      return;
    if (_rec.download_source != 'PURCHASE')
      return;

    _rec.rec_displayed = !_rec.rec_displayed;

  }

  ModifiedRecords(params: any) {
    if (params.stype == "SAVE") {
      this.List();
    }
  }

  UpdateRcItcClaim() {

    if (this.list_rc_status == "" || this.list_rc_status == "ALL" || this.list_rc_status == "PENDING") {
      alert('Please search with valid status');
      return;
    }

    let sPkids: string = "";//Main List
    for (let rec of this.RecordList) {
      if (!this.gs.isBlank(rec.pkid)) {
        if (sPkids != "")
          sPkids += ",";
        sPkids += rec.pkid;
      }
    }

    if (this.gs.isBlank(sPkids)) {
      alert('No records found');
      return;
    }

    if (!confirm("Update " + this.list_rc_status + " items with " + this.recon_claim_status)) {
      return;
    }

    this.loading = true;
    let SearchData = {
      category: this.type,
      pkid: sPkids,
      recon_rc_status: this.recon_rc_status,
      claim_status: this.recon_claim_status,
      claim_period: this.period,
      user_code: this.gs.globalVariables.user_code
    };
    this.ErrorMessage = '';
    this.mainService.UpdateRcItcClaim(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.List();
        alert('Update Successfully');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }


}
