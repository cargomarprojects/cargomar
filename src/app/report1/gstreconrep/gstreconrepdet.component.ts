import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';

@Component({
  selector: 'app-gstreconrepdet',
  templateUrl: './gstreconrepdet.component.html',
  providers: [GstReconRepService]
})

export class GstReconRepDetComponent {
  title = 'GST Reconcile Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() gstinsupplier: string = '';
  @Input() periodid: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

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
    private mainService: GstReconRepService,
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
        gstin_supplier: this.gstinsupplier,
        period_id: this.periodid
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

   
}