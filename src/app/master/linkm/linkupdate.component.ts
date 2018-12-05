import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Linkm } from '../models/linkm';
import { LinkmService } from '../services/linkm.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-linkupdate',
  templateUrl: './linkupdate.component.html',
  providers: [LinkmService]
})
export class LinkupdateComponent  {
  // Local Variables 
  title = 'Link Details';

  @Input() parentData: any;
  @Output() ModifiedRecords = new EventEmitter<any>();

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  lov_type = 'CUSTOMERM2';
  linktype = '';
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
  

  ACCRECORD: SearchTable = new SearchTable();

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
     
    if (this.parentData != null) {
      this.Record.sourcetable = this.parentData.link_source_table;
      this.Record.linkto_code = this.parentData.link_code;
      this.Record.name = this.parentData.link_name;
      this.Record.targettable = this.parentData.link_target_table;
      this.lov_type = this.parentData.link_lov_type;
    }
    this.InitLov('');

    

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
  
  InitLov(saction: string = '') {
      this.ACCRECORD = new SearchTable();
      this.ACCRECORD.controlname = "ACCTM";
      this.ACCRECORD.displaycolumn = "CODE";
      this.ACCRECORD.type = this.lov_type;
      this.ACCRECORD.id = "";
      this.ACCRECORD.code = this.Record.linkto_code;
      this.ACCRECORD.name = "";
  }

  LoadCombo() {
    
    //this.loading = true;
    //let SearchData = {
    //  type: 'type',
    //  comp_code: this.gs.globalVariables.comp_code,
    //  branch_code: this.gs.globalVariables.branch_code
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //  .subscribe(response => {
    //    this.loading = false;
       
    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });

    //this.List("NEW");
  }
  

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "ACCTM") {
      this.Record.targetid = _Record.id;
      this.Record.linkto_code = _Record.code;
      this.Record.linkto_name = _Record.name;
    }
  }
   
  
  // Save Data
  SaveLinkTo() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.pkid = this.gs.getGuid();
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;

        if (this.ModifiedRecords != null)
          this.ModifiedRecords.emit({ saction: 'SAVE', sRec: this.Record });
        
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        
      });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    //if (this.Record.dbk_slno.trim().length <= 0) {
    //  bret = false;
    //  sError = " | Drawback Code Cannot Be Blank";
    //}
       
    //if (bret === false)
    //  this.ErrorMessage = sError;
    return bret;
  }
  

  Close() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'CLOSE', sRec: this.Record });
  }

}
