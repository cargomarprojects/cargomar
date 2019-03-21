import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-jobtransfer',
  templateUrl: './jobtransfer.component.html',
})
export class JobTransferComponent {
  // Local Variables 
  title = 'Job Transfer';

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  modal: any;


  loading = false;
  currentTab = 'LIST';

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';

  modulecategory = "AIR EXPORT";
  moduletype: string = "";
  refnotitle: string = "";
  refno: string = "";
  searchstring = '';
  prefinyear = 2017;
  finyear = 2018;
  ctr: number;

  sub: any;

  // Array For Displaying List
  ModuleList: any[] = [];

  constructor(
    private modalService: NgbModal,
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
    this.prefinyear = +this.gs.globalVariables.year_code - 1;
    this.finyear = +this.gs.globalVariables.year_code;
    this.pkid = '';
    this.refnotitle = "Job#";
    this.refno = "";
    this.moduletype = "JOB";
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
    this.LoadCombo();
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

  LovSelected(_Record: SearchTable) {

  }

  LoadCombo() {
    this.ModuleList = [
      { "code": "JOB", "name": "JOB" },
      { "code": "HOUSE", "name": "SHIPPING INSTRUCTION" },
      { "code": "MASTER", "name": "MASTER" }
    ];
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
  }

  ResetControls() {
  }

  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    // switch (field) {
    //   case 'refno':
    //     {
    //       break;
    //     }
    //   case 'remarks':
    //     {
    //       break;
    //     }
    // }
  }

  onLostFocus(field: string) {

  }
  OnChange(field: string) {
    if (field == 'moduletype') {
      this.pkid = '';
      this.refno = '';
      if (this.moduletype == "JOB") {
        this.refnotitle = "Job#";
      } else if (this.moduletype == "HOUSE") {
        this.refnotitle = "SI#";
      } else if (this.moduletype == "MASTER") {
        this.refnotitle = "MBLBK#";
      }
    }
  }
  OnFocus(field: string) {

  }


  SearchRecord(controlname: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (controlname == "jobtransfer") {
      if (this.moduletype == "JOB" && this.modulecategory.indexOf("IMPORT") >= 0) {
        this.ErrorMessage = "Invalid Transfer";
        alert(this.ErrorMessage);
        return;
      }

      if (+this.refno <= 0) {
        this.ErrorMessage = "Invalid " + this.refnotitle;
        alert(this.ErrorMessage);
        return;
      }

      let strmsg: string = "";
      strmsg = "WANT TO TRANSFER " + this.modulecategory + " " + this.refnotitle.toUpperCase() + " " + this.refno + " TO YEAR " + this.finyear;
      if (!confirm(strmsg)) {
        return;
      }
    }

    this.loading = true;
    let SearchData = {
      table: '',
      type: '',
      pkid: '',
      moduletype: '',
      modulecategory: '',
      refno: '',
      company_code: '',
      branch_code: '',
      year_code: '',
      job_year_code: '',
      user_code: ''
    };

    SearchData.table = "jobtransfer";
    SearchData.refno = this.refno;
    SearchData.moduletype = this.moduletype;
    SearchData.modulecategory = this.modulecategory;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.job_year_code = this.prefinyear.toString();
    SearchData.user_code = this.gs.globalVariables.user_code;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0) {
          this.ErrorMessage = response.serror;
          alert(this.ErrorMessage);
        }
        else {
          this.InfoMessage = " Transfered Successfully ";
          alert(this.InfoMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }
}
