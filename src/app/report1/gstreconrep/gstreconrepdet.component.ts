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

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  bpending: boolean = false;
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
    this.loading = true;
    let SearchData = {
      category: this.type,
      gstin_supplier: this.gstinsupplier,
      period: this.period,
      state_code: this.state_code,
      download_doc_type: this.download_doc_type,
      reverse_charge: this.reverse_charge,
      bpending: this.bpending
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
}
