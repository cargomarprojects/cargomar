import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { EdiHouse } from '../models/edihouse';
import { AmsEdiService } from '../services/amsedi.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-amsedi',
  templateUrl: './amsedi.component.html',
  providers: [AmsEdiService]
})
export class AmsEdiComponent {
  // Local Variables 
  title = 'Data Transfer List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() mblid: string = '';
  @Input() hblid: string = '';
  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;

  @ViewChild('tabset') tabset: any;

  loading = false;
  currentTab = 'LIST';

  bAdmin = false;
  bChanged: boolean;
  user_admin = false;

  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";

  partnercategory = "AMS";
  mode = 'ADD';
  pkid = '';

  sHtml: string = "";
  ctr: number;
  EdiErrorList: any[] = [];
  // Array For Displaying List
  RecordList: EdiHouse[] = [];
  // Single Record for add/edit/view details
  Record: EdiHouse = new EdiHouse;
  KeyList: any[] = [];
  KeydetList: any[] = [];
  KeyfeildList: any[] = [];
  constructor(
    private mainService: AmsEdiService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();
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
    //this.List();
    this.GenerateXml('CHECK-LIST');
  }

  InitComponent() {
    this.bAdmin = false;
    this.user_admin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }

  LovSelected(_Record: SearchTable) {

  }


  ResetControls() {

  }

  List() {
    this.loading = true;

    let SearchData = {
      type: this.type,
      mblid: this.mblid,
      hblid: this.hblid,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.KeyList = response.klist;
        this.KeydetList = response.kdetlist;
        this.KeyfeildList = new Array<any>();
        if (this.KeydetList != null && this.KeydetList != undefined) {
          for (let rec of this.KeydetList.filter(rec => rec.colindex == 0)) {
            this.KeyfeildList.push(rec);
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  // Save Data
  ImportData() {
    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    let SearchData = {
      type: this.type,
      mblid: this.mblid,
      hblid: this.hblid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    SearchData.mblid = this.mblid;
    SearchData.hblid = this.hblid;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.mainService.ImportData(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        alert(this.InfoMessage);
        this.List();
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

  RefreshList() {

    //if (this.RecordList == null)
    //    return;
    //var REC = this.RecordList.find(rec => rec.ord_pkid == this.Record.ord_pkid);
    //if (REC == null) {
    //    this.RecordList.push(this.Record);
    //}
    //else {
    //    REC.ord_po = this.Record.ord_po;
    //    REC.ord_style = this.Record.ord_style;
    //    REC.ord_cargo_status = this.Record.ord_cargo_status;
    //    REC.ord_desc = this.Record.ord_desc;
    //    REC.ord_color = this.Record.ord_color;
    //    REC.ord_contractno = this.Record.ord_contractno;
    //}
  }

  Close() {
    this.gs.ClosePage('home');
  }

  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
  }

  OnBlur(field: string) {
    switch (field) {

      //   case 'BR_CUSTOM_LOCATIONS':
      //     {
      //       this.BR_CUSTOM_LOCATIONS = this.BR_CUSTOM_LOCATIONS.toUpperCase();
      //       break;
      //     }
    }
  }

  ValidateXml() {
    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      user_code: this.gs.globalVariables.user_code,
      hbl_pkid: this.hblid
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.getValidate(SearchData)
      .subscribe(response => {
        this.EdiErrorList = response.list;
        if (response.list.length > 0)
          alert('pls check the Error List tab to see the Missing Data');
        else
          alert('No Missing Data Found');
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  GenerateXml(_type: string) {
    this.ErrorMessage = '';
    // if (this.Record.book_agent_id.trim().length <= 0) {
    //   this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
    //   return;
    // }
    // if (this.Record.book_agent_name.indexOf("RITRA") < 0) {
    //   this.ErrorMessage = "\n\r | Invalid Agent Selected";
    //   return;
    // }
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      category: this.partnercategory,
      agent_id: '',
      agent_code: 'MOTHERLINES',
      agent_name: '',
      type: '',
      rowtype: '',
      pkid: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.branch_name = this.gs.globalVariables.branch_name;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.category = this.partnercategory;
    SearchData.rowtype = _type;
    // SearchData.agent_id = this.Record.book_agent_id;
    // SearchData.agent_code = this.Record.book_agent_code;
    // SearchData.agent_name = this.Record.book_agent_name;
    SearchData.pkid = this.hblid;

    this.mainService.GenerateXml(SearchData)
      .subscribe(response => {
        this.loading = false;
        // this.sSubject += ", " + response.subject + ", MBL- " + this.Record.book_mblno;
        // this.FtpAttachList = new Array<any>();
        // this.FileList = response.filelist;
        // for (let rec of this.FileList) {
        //   this.FtpAttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: 'FTP-FOLDER', fileisack: 'N', fileprocessid: rec.fileprocessid, filesize: rec.filesize });
        // }
        // if (response.poftpexist)
        //   this.GenerateXmlPO('FTP', ftpsent);
        // else {
        //   this.PoFtpAttachList = new Array<any>();
        //   this.open(ftpsent);
        // }

        if (_type == "CHECK-LIST") {
          this.sHtml = response.xslthtml;
          this.tabset.select('tabchk');
        }
        else
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);


      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

}
