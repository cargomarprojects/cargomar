import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
})
export class UnLockComponent {
  // Local Variables 
  title = 'Unlock Module';

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  modal: any;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  unlockdate = "";
  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';

  searchstring = '';

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
  chkresetirn: boolean = false;
  chkresetjobprefix: boolean = false;
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
    this.pkid = '';
    this.refno = '';
    this.refnodesc = '';
    this.chkdate = false;
    this.chkcc = false;
    this.refnotitle = "Vr.No";
    this.moduletype = "JV";
    this.chkresetfldr = false;
    this.chkbpreaprvd = false;
    this.chkresetirn = false;
    this.chkresetjobprefix = false;
    this.unlockdate = this.gs.defaultValues.today;
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
      { "code": "BP", "name": "Bank Payment" },
      { "code": "JV-BP", "name": "Bank Payment HO(JV-BP)" },
      { "code": "BR", "name": "Bank Receipt" },
      { "code": "CP", "name": "Cash Payment" },
      { "code": "CR", "name": "Cash Receipt" },
      { "code": "JV", "name": "Journal Voucher" },
      { "code": "HO", "name": "Costing Journal Voucher" },
      { "code": "IN", "name": "Invoice" },
      { "code": "PN", "name": "MBL Invoice(PN)" },
      { "code": "PN-JV", "name": "General Expense(PN-JV)" },
      { "code": "OP", "name": "Opening Balance" },
      { "code": "OI", "name": "Opening Invoice" },
      { "code": "OC", "name": "Costing Opening Invoice" },
      { "code": "OB", "name": "Opening Bank" },
      { "code": "DN", "name": "Debit Note(DN)" },
      { "code": "CN", "name": "Credit Note(CN)" },
      { "code": "DI", "name": "Inward Debit Note(DI)" },
      { "code": "CI", "name": "Inward Credit Note(CI)" },
      { "code": "PN-CI", "name": "Inward Credit Note(GE)" },
      { "code": "FUND-TRANSFER", "name": "Fund Transfer" },
      { "code": "MBL-AE", "name": "Air Export Folder" },
      { "code": "MBL-AI", "name": "Air Import Folder" },
      { "code": "MBL-SE", "name": "Sea Export Folder" },
      { "code": "MBL-SI", "name": "Sea Import Folder" },
      { "code": "HBL-AE", "name": "Air Export Shipping Instructions" },
      { "code": "HBL-AI", "name": "Air Import Shipping Instructions" },
      { "code": "HBL-SE", "name": "Sea Export Shipping Instructions" },
      { "code": "HBL-SI", "name": "Sea Import Shipping Instructions" },
      { "code": "JOB-GN", "name": "General Job" },
      { "code": "JOB-AE", "name": "Air Export Job" },
      { "code": "JOB-SE", "name": "Sea Export Job" },
      { "code": "AIR EXPORT COSTING", "name": "Air Export Costing" },
      { "code": "SEA EXPORT COSTING", "name": "Sea Export Costing" },
      { "code": "SE CONSOLE COSTING", "name": "Sea Console Costing" },
      { "code": "AGENT INVOICE", "name": "Agent Invoice" },
      { "code": "DRCR ISSUE", "name": "DRCR Issue" },
      { "code": "HR-EMPLOYEE-MASTER", "name": "Employee Master" },
      { "code": "HR-SALARY-MASTER", "name": "Salary Master" },
      { "code": "HR-PAYROLL", "name": "Payroll" },
      { "code": "HR-BONUS", "name": "Bonus" },
      { "code": "HR-PAYSLIP-MAIL", "name": "Payslip Mail" },
      { "code": "HR-LEAVE-MASTER", "name": "Leave Master" },
      { "code": "HR-LEAVE-DETAILS", "name": "Leave Details" },
      { "code": "HR-RE-JVPOST", "name": "Repost Payroll" },
      { "code": "HR-TRAVEL-EXPENSE", "name": "Travel Expense" },
      { "code": "GSTR-2B", "name": "Gstr 2B" },
      { "code": "LOCK-ALL", "name": "Lock/Unlock All Records (" + this.gs.globalVariables.year_name + ")" }
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
          this.SearchRecord('refno');
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
    if (field == 'moduletype') {
      this.pkid = '';
      this.refno = '';
      this.refnodesc = '';
      this.chkresetfldr = false;
      this.chkbpreaprvd = false;
      this.chkresetirn = false;
      this.chkresetjobprefix = false;
      if (this.moduletype == "BP" || this.moduletype == "BR" || this.moduletype == "CP" || this.moduletype == "CR" ||
        this.moduletype == "JV" || this.moduletype == "HO" || this.moduletype == "IN" || this.moduletype == "PN" || this.moduletype == "PN-JV" ||
        this.moduletype == "OP" || this.moduletype == "OI" || this.moduletype == "OC" || this.moduletype == "OB" ||
        this.moduletype == "DN" || this.moduletype == "CN" || this.moduletype == "DI" || this.moduletype == "CI" || this.moduletype == "PN-CI" || this.moduletype == "JV-BP") {
        this.refnotitle = "Vr.No";
      } else if (this.moduletype == "MBL-AE" || this.moduletype == "MBL-AI" ||
        this.moduletype == "MBL-SE" || this.moduletype == "MBL-SI") {
        if (this.moduletype.indexOf("S") >= 0)
          this.refnotitle = "Folder#/MBL";
        else
          this.refnotitle = "Folder/MAWB";
      } else if (this.moduletype == "HBL-AE" || this.moduletype == "HBL-AI" ||
        this.moduletype == "HBL-SE" || this.moduletype == "HBL-SI") {
        this.refnotitle = "SI#";
      } else if (this.moduletype == "AGENT INVOICE" || this.moduletype == "AIR EXPORT COSTING" ||
        this.moduletype == "DRCR ISSUE" || this.moduletype == "SEA EXPORT COSTING" || this.moduletype == "SE CONSOLE COSTING") {
        this.refnotitle = "Folder#";
      } else if (this.moduletype == "JOB-GN") {
        this.refnotitle = "Job#";
      } else if (this.moduletype == "FUND-TRANSFER") {
        this.refnotitle = "Ref#";
      } else if (this.moduletype == "HR-TRAVEL-EXPENSE") {
        this.refnotitle = "SlNo#";
      } else if (this.moduletype == "JOB-AE" || this.moduletype == "JOB-SE") {
        this.refnotitle = "Job#";
      }
      else if (this.moduletype.indexOf('HR-') == 0) {
        if (this.moduletype == "HR-RE-JVPOST")
          this.refnotitle = "JV#";
        else
          this.refnotitle = "Employee#";
      } else if (this.moduletype == "GSTR-2B") {
        this.refnotitle = "State Code";
      }
    }
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

    if (this.moduletype == "LOCK-ALL") {
      if (controlname == "lock")
        this.ErrorMessage = " LOCK ALL RECORDS " + this.gs.globalVariables.year_name;
      else
        this.ErrorMessage = " UNLOCK ALL RECORDS " + this.gs.globalVariables.year_name;
      if (!confirm(this.ErrorMessage)) {
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
      chkresetfldr: '',
      company_code: '',
      branch_code: '',
      year_code: '',
      user_code: '',
      cntrltype: '',
      chkbpreaprvd: '',
      unlockdate: '',
      chkresetirn: '',
      chkresetjobprefix: ''
    };

    if (controlname == "save" || controlname == "lock")
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
    SearchData.unlockdate = this.unlockdate;
    SearchData.chkresetirn = this.chkresetirn == true ? "Y" : "N";
    SearchData.chkresetjobprefix = this.chkresetjobprefix == true ? "Y" : "N";

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
          alert(this.ErrorMessage);
        });
  }

  UnlockRecord(savetype: string) {

    if (this.moduletype != "LOCK-ALL") {

      if (this.refno.toString().trim().length <= 0) {
        this.ErrorMessage = " Reference# Cannot be blank ";
        alert(this.ErrorMessage);
        return;
      }

      if (this.pkid.toString().trim().length <= 0) {
        this.ErrorMessage = " Invalid Reference ID ";
        alert(this.ErrorMessage);
        return;
      }
    }
    if (this.remarks.toString().trim().length <= 0) {
      this.ErrorMessage = " Remarks Cannot be blank ";
      alert(this.ErrorMessage);
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
