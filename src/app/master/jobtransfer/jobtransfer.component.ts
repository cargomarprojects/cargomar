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

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';
  
  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  
  modulecategory="AE";
  searchstring = '';
  finyear=2016;
  ctr: number;
 
  sub: any;
  bValueChanged: boolean = false;
  moduletype: string = "";
  refnotitle: string = "";
  refno: string = "";
  refnodesc: string = "";
  chkdate: boolean = false;
  chkcc: boolean = false;
  remarks: string = "";
  chkresetfldr: boolean = false;
  chkbpreaprvd: boolean = false;

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
      this.finyear= +this.gs.globalVariables.year_code-1
    this.pkid = '';
    this.refno = '';
    this.refnodesc = '';
    this.chkdate = false;
    this.chkcc = false;
    this.refnotitle = "Job No";
    this.moduletype = "JOB";
    this.chkresetfldr = false;
    this.chkbpreaprvd=false; 
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
    switch (field) {
      case 'refno':
        {
          this.refno = this.refno.toUpperCase();
          //this.SearchRecord('refno');
          break;
        }
      case 'remarks':
        {
          this.remarks = this.remarks.toUpperCase();
          break;
        }
    }
  }

  onLostFocus(field: string) {
    
  }
  OnChange(field: string) {
    // if (field == 'moduletype') {
    //   this.pkid = '';
    //   this.refno = '';
    //   this.refnodesc = '';
    //   this.chkresetfldr = false;
    //   this.chkbpreaprvd = false;
    //   if (this.moduletype == "BP" || this.moduletype == "BR" || this.moduletype == "CP" || this.moduletype == "CR" ||
    //     this.moduletype == "JV" || this.moduletype == "HO" || this.moduletype == "IN" || this.moduletype == "PN" ||
    //     this.moduletype == "OP" || this.moduletype == "OI" || this.moduletype == "OC" || this.moduletype == "OB" ||
    //     this.moduletype == "DN" || this.moduletype == "CN" || this.moduletype == "DI" || this.moduletype == "CI") {
    //     this.refnotitle = "Vr.No";
    //   } else if (this.moduletype == "MBL-AE" || this.moduletype == "MBL-AI" ||
    //     this.moduletype == "MBL-SE" || this.moduletype == "MBL-SI") {
    //     if (this.moduletype.indexOf("S") >= 0)
    //       this.refnotitle = "Folder#/MBL";
    //     else
    //       this.refnotitle = "Folder/MAWB";
    //   } else if (this.moduletype == "HBL-AE" || this.moduletype == "HBL-AI" ||
    //     this.moduletype == "HBL-SE" || this.moduletype == "HBL-SI") {
    //       this.refnotitle = "SI#";
    //   } else if (this.moduletype == "AGENT INVOICE" || this.moduletype == "AIR EXPORT COSTING" ||
    //     this.moduletype == "DRCR ISSUE" || this.moduletype == "SEA EXPORT COSTING"|| this.moduletype == "SE CONSOLE COSTING") {
    //     this.refnotitle = "Folder#";
    //   } else if (this.moduletype == "JOB-GN") {
    //     this.refnotitle = "Job#";
    //   }
    // }
  }
  OnFocus(field: string) {
    if (field == 'search')
      this.bValueChanged = false;
  }


  SearchRecord(controlname: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (controlname == "refno") {
      if (this.refno.trim().length <= 0) {
        return;
      }
    }
     
    this.loading = true;
    let SearchData = {
      table: '',
      type: 'LOAD',
      moduletype: '',
      pkid: '',
      refno: '',
      refnodesc: '',
      remarks: '',
      chkdate: '',
      chkcc: '',
      chkresetfldr:'',
      company_code: '',
      branch_code: '',
      year_code: '',
      user_code: '',
      cntrltype: '',
      chkbpreaprvd:''
    };

    if (controlname == "save" || controlname == "lock" )
      SearchData.type = "SAVE";
    else
      SearchData.type = "LOAD";
    SearchData.table = "unlockmodule";
    SearchData.refno = this.refno;
    SearchData.moduletype = this.moduletype;
    SearchData.pkid = this.pkid;
    SearchData.refnodesc = this.refnodesc;
    SearchData.remarks = this.remarks;
    SearchData.chkdate = this.chkdate == true ? "Y" : "N";
    SearchData.chkcc = this.chkcc == true ? "Y" : "N";
    SearchData.chkresetfldr = this.chkresetfldr == true ? "Y" : "N";
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.cntrltype = controlname;
    SearchData.chkbpreaprvd = this.chkbpreaprvd == true ? "Y" : "N";

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (controlname == 'refno') {
          this.pkid = "";
          this.refnodesc = "";
          if (response.pkid.length > 0) {
            this.pkid = response.pkid;
            this.refnodesc = response.refno;
          } else {
            this.ErrorMessage = " Invalid Reference Number ";
            alert(this.ErrorMessage);
          }
        }
        if (controlname == 'save' || controlname == 'lock') {
          this.pkid = response.pkid;
          if (controlname == 'save')
            this.InfoMessage = " Unlocked Successfully ";
          else
            this.InfoMessage = " Locked Successfully ";
          alert(this.InfoMessage);
        }

      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
   
  UnlockRecord(savetype: string) {

    if (this.refno.toString().trim().length <= 0) {
      this.ErrorMessage = " Reference# Cannot be blank ";
      return;
    }

    if (this.pkid.toString().trim().length <= 0) {
      this.ErrorMessage = " Invalid Reference ID ";
      return;
    }
     
    if (this.remarks.toString().trim().length <= 0) {
      this.ErrorMessage = " Remarks Cannot be blank ";
      return;
    }
    this.SearchRecord(savetype);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }
  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.open(history);
  }
}
