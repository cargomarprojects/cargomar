import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-ftplog',
  templateUrl: './ftplog.component.html',
//   providers: [RepService]
})

export class FtpLogComponent {
  title = 'FTP Log Report'

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

  constructor(
    // private mainService: RepService,
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
   
  Close() {
    this.gs.ClosePage('home');
  }

}
