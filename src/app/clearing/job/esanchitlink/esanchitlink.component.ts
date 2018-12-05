import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
 import { EsanchitLinkService } from '../../services/esanchitlink.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Esanchit } from '../../../master/models/esanchit';


@Component({
  selector: 'app-esanchitlink',
  templateUrl: './esanchitlink.component.html',
  providers: [EsanchitLinkService]
})
export class EsanchitLinkComponent {
  // Local Variables 
  title = 'Esanchit List';
    
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() jobid: string = '';
  @Input() jobno: string = '';
  @Input() linktype: string = '';
  @Input() linkid: string = '';
  @Input() linkno: string = '';

  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
   
  loading = false;
  currentTab = 'LIST';
  
  from_date: string = "";
  searchstring = "";
  ErrorMessage = "ABC";
  InfoMessage = "";

  mode = 'ADD';
  pkid = '';

  ctr: number;

  // Array For Displaying List
  RecordList: Esanchit[] = [];
  // Single Record for add/edit/view details
  Record: Esanchit = new Esanchit;
   

  constructor(
    private mainService: EsanchitLinkService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
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
    this.List("NEW");
  }

  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    //if (this.menu_record) {
    //}
    this.from_date = "";
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }

  LovSelected(_Record: SearchTable) {

  }
  
  List(_type: string) {
    this.loading = true;

    let SearchData = {
      type: _type,
      linktype: this.linktype,
      linkid: this.linkid,
      jobid: this.jobid,
      jobno: this.jobno,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      from_date: this.from_date
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
    
  Save(_type: string) {
    if (!this.allvalid())
      return;
    
    this.InfoMessage = "";
    this.ErrorMessage = "";
    let DocPkid: string = "";
    for (let rec of this.RecordList.filter(rec => rec.doc_selected == true)) {
      if (DocPkid != "")
        DocPkid += ",";
      DocPkid += rec.doc_pkid;
    }

    if (DocPkid == "") {
      this.ErrorMessage = "Please Select and Continue.....";
      return;
    }

    if (_type == "CLEAR") {
      if (!confirm("Do you want to Clear the LINK")) {
        return;
      }
    }

    this.loading = true;
    let SearchData = {
      pkid: DocPkid,
      linktype: this.linktype,
      linkid: this.linkid,
      jobid: this.jobid,
      jobno: this.jobno,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    SearchData.pkid = DocPkid;
    if (_type == "SAVE") {
      SearchData.linktype = this.linktype;
      SearchData.linkid = this.linkid;
    } else {
      SearchData.linktype = "";
      SearchData.linkid = "";
    }
    SearchData.jobid = this.jobid;
    SearchData.jobno = this.jobno;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.mainService.Save(SearchData)
      .subscribe(response => {
        this.loading = false;
        //this.jobno = response.jobno;
        this.InfoMessage = "Save Complete";
        alert(this.InfoMessage);
        if (_type == "SAVE") {
          this.RefreshList(this.linktype);
        } else {
          this.RefreshList("");
        }
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
    
    /*
      if (this.Record.ord_desc.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Description Cannot Be Blank";
      }
    */


    //if (bret === false)
    //    this.ErrorMessage = sError;

    return bret;
  }

  RefreshList(_ltype: string) {
    if (this.RecordList == null)
        return;
    for (let rec of this.RecordList.filter(rec => rec.doc_selected == true)) {
      rec.doc_link_type = _ltype;
      rec.doc_selected = false;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }
  

  OnBlur(field: string) {
    switch (field) {

      //case 'BR_CUSTOM_LOCATIONS':
      //  {
      //    this.BR_CUSTOM_LOCATIONS = this.BR_CUSTOM_LOCATIONS.toUpperCase();
      //    break;
      //  }
    }
  }

   
  
}
