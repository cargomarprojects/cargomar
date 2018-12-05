import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Linkm } from '../models/linkm';
import { LinkmService } from '../services/linkm.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-linkm',
  templateUrl: './linkm.component.html',
  providers: [LinkmService]
})
export class LinkmComponent  {
  // Local Variables 
  title = 'Link Details';

  @ViewChild('addressComponent') addressComponent: any;


  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  LinkRecord = {
    link_code: '',
    link_name: '',
    link_source_table: '',
    link_target_table: '',
    link_lov_type: '' 
  };

  linksource = 'DT_SHIPPER_OPENING';
  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  
  ErrorMessage = "";
  InfoMessage = "";

  displayname: string = "Shipper Opening";
  sourcetable: string =  "DT_SHIPPER_OP";
  targettable: string =  "ACCTM";
  targetcodecolumn: string =  "ACC_CODE";
  targetnamecolumn: string =  "ACC_NAME";
  targetpkidcolumn: string =  "ACC_PKID";
  lovtype: string = "ACCTM";
  
  mode = '';
  pkid = '';
  LinkList: any[] = [];
  // Array For Displaying List
  RecordList: Linkm[] = [];
  // Single Record for add/edit/view details
  Record: Linkm = new Linkm;

  constructor(
    private mainService: LinkmService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
    
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
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  LoadCombo() {
    
    this.LinkList = [
      { "displayname": "Opening", "sourcetable": "DT_OPENING", "targettable": "ACCTM", "targetcodecolumn": "ACC_CODE", "targetnamecolumn": "ACC_NAME", "targetpkidcolumn": "ACC_PKID", "lovtype": "ACCTM" },
      { "displayname": "Shipper Opening", "sourcetable": "DT_SHIPPER_OPENING", "targettable": "ACCTM", "targetcodecolumn": "ACC_CODE", "targetnamecolumn": "ACC_NAME", "targetpkidcolumn": "ACC_PKID", "lovtype": "ACCTM" },
      { "displayname": "Creditors Opening", "sourcetable": "DT_CREDITORS_OPENING", "targettable": "ACCTM", "targetcodecolumn": "ACC_CODE", "targetnamecolumn": "ACC_NAME", "targetpkidcolumn": "ACC_PKID", "lovtype": "ACCTM" }
      ];
  }
  
  LovSelected(_Record: any) {
  }
   
  // Query List Data
  List(_type: string) {

    if (this.linksource == '')
      return;
   
    this.LinkList.forEach(rec => {
      if (rec.sourcetable == this.linksource) {
        this.displayname = rec.displayname;
        this.sourcetable = rec.sourcetable;
        this.targettable = rec.targettable;
        this.targetcodecolumn = rec.targetcodecolumn;
        this.targetnamecolumn = rec.targetnamecolumn;
        this.targetpkidcolumn = rec.targetpkidcolumn;
        this.lovtype = rec.lovtype;
      }
    });

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      source_table: this.sourcetable,
      target_table: this.targettable,
      target_codecolumn: this.targetcodecolumn,
      target_namecolumn: this.targetnamecolumn,
      target_pkidcolumn: this.targetpkidcolumn
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  showhiderow(rec: Linkm) {
    rec.rowdisplayed = !rec.rowdisplayed;
    if (rec.linkto_name.trim().length > 0)
      rec.rowdisplayed = false;
    this.LinkRecord.link_code = rec.linkcode;
    this.LinkRecord.link_name = rec.linkname;
    this.LinkRecord.link_source_table = this.sourcetable;
    this.LinkRecord.link_target_table = this.targettable;
    this.LinkRecord.link_lov_type = this.lovtype;
  }

  ModifiedRecords(params: any, rec: Linkm) {
    if (params.saction == "CLOSE")
      rec.rowdisplayed = false;

    if (params.saction == "SAVE") {
      rec.linkto_code = params.sRec.linkto_code;
      rec.linkto_name = params.sRec.linkto_name;
      rec.pkid = params.sRec.pkid;
      rec.rowdisplayed = false;
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        var REC = this.RecordList.find(rec => rec.pkid == Id);
        if (REC != null) {
          REC.linkto_code = "";
          REC.linkto_name = "";
          REC.pkid = "";
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
  Close() {
    this.gs.ClosePage('home');
  }
  
}
