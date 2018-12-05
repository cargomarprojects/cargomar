import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { TrackReport } from '../models/Track';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  providers: [RepService]
})

export class TrackComponent {
  title = 'Tracking Report'

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  loading = false;

  currentTab = 'LIST';
  searchcntrno = '';
  searchblno = '';

  // Array For Displaying List
  RecordList: TrackReport[] = [];
  // Single Record for add/edit/view details
  Record: TrackReport = new TrackReport;

  constructor(
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
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.RecordList = null;
    this.searchcntrno = "";
    this.searchblno = "";
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
  }
  LoadCombo() {
  }


  // Query List Data
  TrackList(_type: string) {

    this.ErrorMessage = '';
    if (this.searchcntrno.trim().length <= 0 && this.searchblno.trim().length <= 0) {
      this.RecordList = null;
      this.ErrorMessage = "Invalid Search";
      return;
    }

    let SearchData = {
      id: "2018",
      cntrno: this.searchcntrno,
      hblno: this.searchblno
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.TrackList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
      error => {
        this.loading = false;
        this.RecordList = null;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

   
  Close() {
    this.gs.ClosePage('home');
  }

}
