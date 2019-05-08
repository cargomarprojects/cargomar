import { Component, Input,Output, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Addressdel } from '../models/addressdel';
import { AddbookService } from '../services/addbook.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-addbookdel',
  templateUrl: './addbookdel.component.html',
  providers: [AddbookService]
})
export class AddbookdelComponent {
  // Local Variables 
  title = 'Address MASTER';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() addrpkid: string ='';

  InitCompleted: boolean = false;
  menu_record: any;

  bDocs = false;
  canadd = true;

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
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.LoadCombo();
    this.List('NEW');
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
    this.ErrorMessage='';
    if (this.addrpkid.trim().length <= 0) {
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
      addid: this.addrpkid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.AddressLinkList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  OnBlur(field: string) {

  }

  Close() {
    this.gs.ClosePage('home');
  }


}
