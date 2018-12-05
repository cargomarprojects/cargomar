import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ReconService } from '../services/recon.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-recondate',
  templateUrl: './recondate.component.html',
  providers: [ReconService]
})

export class RecondateComponent {
  // Local Variables 
  title = 'Link Details';
  @Input() pkid: string = '';
  @Input() inputdate: string;
  @Input() displaydate: string;
  @Input() parentData: any;
  @Output() RetData = new EventEmitter<any>();



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



  SearchData = {
    pkid: '',
    inputdate: '',
    user_code: ''
  }




  // Array For Displaying List

  // Single Record for add/edit/view details


  constructor(
    private mainService: ReconService,
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

    }
  }



  // Save Data
  Save() {
    /*
    if (!this.allvalid())
      return;
    */

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.SearchData.pkid = this.pkid;
    this.SearchData.inputdate = this.inputdate;
    this.SearchData.user_code = this.gs.globalVariables.user_code;


    this.mainService.UpdateRecon(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.inputdate = this.inputdate;
        this.displaydate = response.displaydate;
        if (this.RetData != null)
          this.RetData.emit({ saction: 'SAVE', displaydate: this.displaydate, inputdate: this.inputdate });
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

    if (this.inputdate.toString().length <= 0) {
      bret = false;
      sError = " | Date Cannot Be Blank";
    }

    //if (bret === false)
    //  this.ErrorMessage = sError;
    return bret;
  }


  Close() {

    if (this.RetData != null)
      this.RetData.emit({ saction: 'CLOSE', displaydate: '', inputdate: '' });
  }

}
