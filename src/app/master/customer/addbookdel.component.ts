import { Component, Input, Output, OnInit, OnDestroy, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Addressdel } from '../models/addressdel';
import { AddbookService } from '../services/addbook.service';

@Component({
  selector: 'app-addbookdel',
  templateUrl: './addbookdel.component.html',
  providers: [AddbookService]
})
export class AddbookdelComponent {
  // Local Variables 
  title = 'Address MASTER';
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() public addid: string = '';

  InitCompleted: boolean = false;
  menu_record: any;

  bDocs = false;
  canadd = true;
  cannotdelete: boolean = true;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  mdate: string;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';



  // Array For Displaying List
  RecordList: Addressdel[] = [];
  // Single Record for add/edit/view details
  Record: Addressdel = new Addressdel;

  constructor(
    private mainService: AddbookService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {

    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
    this.InitLov();
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
    this.List('NEW');
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.LoadCombo();

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  InitLov() {

  }



  LoadCombo() {

  }


  LovSelected(_Record: any) {

  }

  // Query List Data
  List(_type: string) {
    this.ErrorMessage = '';
    if (this.addid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      addid: this.addid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.AddressLinkList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        if (this.RecordList.length > 0)
          this.cannotdelete = true;
        else
          this.cannotdelete = false;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  OnBlur(field: string) {

  }

  Close() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'CLOSE', sid: this.addid });
  }

  RemoveRecord() {
    this.ErrorMessage = '';
    if (this.RecordList.length > 0) {
      this.ErrorMessage = "Cannot Delete, Already Linked";
      return;
    }

    if (!confirm("Do you want to Delete")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: this.addid,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      user_pkid: this.gs.globalVariables.user_pkid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (this.ModifiedRecords != null)
          this.ModifiedRecords.emit({ saction: 'DELETE', sid: this.addid });
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
