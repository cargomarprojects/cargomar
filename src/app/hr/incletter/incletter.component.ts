import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { HrReport } from '../models/hrreport';
import { HrReportService } from '../services/hrreport.service';

@Component({
  selector: 'app-incletter',
  templateUrl: './incletter.component.html',
  providers: [HrReportService]
})
export class IncLetterComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
   
  InitCompleted: boolean = false;
  menu_record: any;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';
  
  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  jobno = '';
  searchstring = '';

  ctr: number;
  jobdisabled = false;
  sub: any;
  bValueChanged: boolean = false;

  // Array For Displaying List
  RecordList: HrReport[] = [];
  // Single Record for add/edit/view details
  Record: HrReport = new HrReport;

   
  constructor(
    private mainService: HrReportService,
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
    this.InitLov();
  }


  InitComponent() {
    this.jobno = '';
    this.searchstring = '';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
     
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {


  }


  List(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.title = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.title = response.containerno;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    //this.Record = new HrReport();
    
    this.InitLov();

    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    //this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
  }

 

  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'opr_sbill_no':
        {
        //   this.Record.opr_sbill_no = this.Record.opr_sbill_no.toUpperCase();
        //   this.SearchRecord('opr_sbill_no');
          break;
        }
     
    }
  }

  onLostFocus(field: string) {
    // if (this.bValueChanged && field == 'search') {
    
    // }
  }
  OnChange(field: string) {
    if (field == 'search')
      this.bValueChanged = true;
  }
  OnFocus(field: string) {
    if (field == 'search')
      this.bValueChanged = false;
  }

  
}
