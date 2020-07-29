import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { OnlineTrackMasterService } from '../../services/onlinetrackmaster.service';
import { Trackingm } from '../../../operations/models/tracking';

@Component({
  selector: 'app-onlinetrackmasterdet',
  templateUrl: './onlinetrackmasterdet.component.html',
  providers: [OnlineTrackMasterService]
})

export class OnlineTrackMasterDetComponent {
  // Local Variables 
  title = '';
 
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() record: Joborderm;
  @Input() type: '';

  pkid: string = '';
  remarks: string = '';
      
  
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  
  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  
  SearchData = {
    pkid: '',
    remarks: ''
  }
  
  // Array For Displaying List
  RecordList: Trackingm[] = [];
  RecordList2: Joborderm[] = [];
  // Single Record for add/edit/view details


  constructor(
    private mainService: OnlineTrackMasterService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.List('NEW');
  }

  InitComponent() {
    
  }

  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,   
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
     mblid:this.record.ord_mbl_id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.TrackingList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.tracklist;
       // this.RecordList2 = response.ordlist;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Close() {
    this.record.row_displayed=false;
  }

}
