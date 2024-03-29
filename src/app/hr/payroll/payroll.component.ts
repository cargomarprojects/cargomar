import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Salarym } from '../models/salarym';
import { SalDet } from '../models/salarym';
import { PayRollService } from '../services/payroll.service';
import { Deductm, Deductd } from '../models/deductm';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  providers: [PayRollService]
})
export class PayRollComponent {
  /*
  Ajith 24/05/2019 print rights set for payslip
  
  */
  // Local Variables 
  title = 'SALARY MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  bPayrollSave: boolean = false;
  lock_record: boolean = false;
  bPrint: boolean = false;
  bAdmin: boolean = false;
  bEmail: boolean = false;
  bDocs: boolean = false;
  chkallselected: boolean = false;
  selectdeselect: boolean = false;
  allbranch: boolean = false;
  bRemove: boolean = false;
  bChanged: boolean;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  bapprovalstatus = "";
  searchstring = '';
  salh_jvno = 0;
  salh_jvno_ho = 0;

  pf_jvno = 0;
  pf_jvno_ho = 0;
  lwf_jvno = 0;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  modal: any;
  sub: any;
  urlid: string;

  salyear = 0;
  salmonth = 0;
  payment_date: string = '';
  payment_date_pkid: string = '';
  payment_date_remark: string = '';
  payment_date_all: boolean = false;

  empstatus = "BOTH";
  ErrorMessage = "";
  InfoMessage = "";
  csvamt: string;
  docpkid: string;
  FileList: any[] = [];
  SalDetails: any[] = [];
  mode = '';
  pkid = '';
  // Array For Displaying List
  RecordList: Salarym[] = [];
  RecordList2: Salarym[] = [];
  // Single Record for add/edit/view details
  Record: Salarym = new Salarym;
  Recorddet: SalDet = new SalDet;
  RecordList3: Deductd[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: PayRollService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 100;
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
    this.bapprovalstatus = "";
    this.empstatus = 'BOTH';
    this.bRemove = true;
    this.bAdmin = false;
    this.bEmail = false;
    this.bPrint = false;
    this.bDocs = false;
    this.bPayrollSave = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_email)
        this.bEmail = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
      if (this.menu_record.rights_approval.length > 0) {
        this.bapprovalstatus = this.menu_record.rights_approval.toString();
        if (this.bapprovalstatus.indexOf('{SAVE}') >= 0 || this.gs.globalVariables.user_code == "ADMIN")
          this.bPayrollSave = true;
      }
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
    this.InitLov();
    if (this.gs.defaultValues.today.trim() != "") {
      var tempdt = this.gs.defaultValues.today.split('-');
      this.salyear = +tempdt[0];
      this.salmonth = +tempdt[1];
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, empid: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      //this.currentTab = 'DETAILS';
      //this.mode = 'ADD';
      //this.ResetControls();
      //this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }

  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    if (this.mode == "EDIT")
      return this.disableSave;
  }

  // Query List Data
  List(_type: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.salyear <= 0) {
      this.ErrorMessage += " | Invalid Year";
    } else if (this.salyear < 100) {
      this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
    }
    if (this.salmonth > 12) { //this.salmonth <= 0 ||
      this.ErrorMessage += " | Invalid Month";
    }
    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      salmonth: this.salmonth,
      salyear: this.salyear,
      empstatus: this.empstatus,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
        this.Recorddet = response.record;
        this.salh_jvno = response.saljvno;
        this.salh_jvno_ho = response.saljvno_ho;
        this.pf_jvno = response.pfjvno;
        this.pf_jvno_ho = response.pfjvno_ho;
        this.lwf_jvno = response.lwfjvno;
        this.chkallselected = false;
        this.selectdeselect = false;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.mode = response.mode;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: Salarym) {
    this.Record = _Record;
    this.InitLov();
    this.Record.rec_mode = this.mode;

    this.lock_record = true;
    if (this.Record.sal_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.FindNetAmt();
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    //if (this.Record.job_date.trim().length <= 0) {
    //  bret = false;
    //  sError = " | Job Date Cannot Be Blank";
    //}

    //if (this.Record.sal_code.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | Code Cannot Be Blank";
    //}

    //if (this.Record.sal_desc.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | Description Cannot Be Blank";
    //}

    //if (this.Record.sal_head_order <= 0) {
    //  bret = false;
    //  sError += "\n\r | Invalid  order ";
    //}


    //if (bret === false)
    //  this.ErrorMessage = sError;
    if (bret) {
      this.Record.a01 = this.Record.DetList[0].e_amt1; this.Record.a13 = this.Record.DetList[0].e_amt2;
      this.Record.a02 = this.Record.DetList[1].e_amt1; this.Record.a14 = this.Record.DetList[1].e_amt2;
      this.Record.a03 = this.Record.DetList[2].e_amt1; this.Record.a15 = this.Record.DetList[2].e_amt2;
      this.Record.a04 = this.Record.DetList[3].e_amt1; this.Record.a16 = this.Record.DetList[3].e_amt2;
      this.Record.a05 = this.Record.DetList[4].e_amt1; this.Record.a17 = this.Record.DetList[4].e_amt2;
      this.Record.a06 = this.Record.DetList[5].e_amt1; this.Record.a18 = this.Record.DetList[5].e_amt2;
      this.Record.a07 = this.Record.DetList[6].e_amt1; this.Record.a19 = this.Record.DetList[6].e_amt2;
      this.Record.a08 = this.Record.DetList[7].e_amt1; this.Record.a20 = this.Record.DetList[7].e_amt2;
      this.Record.a09 = this.Record.DetList[8].e_amt1; this.Record.a21 = this.Record.DetList[8].e_amt2;
      this.Record.a10 = this.Record.DetList[9].e_amt1; this.Record.a22 = this.Record.DetList[9].e_amt2;
      this.Record.a11 = this.Record.DetList[10].e_amt1; this.Record.a23 = this.Record.DetList[10].e_amt2;
      this.Record.a12 = this.Record.DetList[11].e_amt1; this.Record.a24 = this.Record.DetList[11].e_amt2;
      this.Record.a25 = 0;
      this.Record.d01 = this.Record.DetList[0].d_amt1; this.Record.d13 = this.Record.DetList[0].d_amt2;
      this.Record.d02 = this.Record.DetList[1].d_amt1; this.Record.d14 = this.Record.DetList[1].d_amt2;
      this.Record.d03 = this.Record.DetList[2].d_amt1; this.Record.d15 = this.Record.DetList[2].d_amt2;
      this.Record.d04 = this.Record.DetList[3].d_amt1; this.Record.d16 = this.Record.DetList[3].d_amt2;
      this.Record.d05 = this.Record.DetList[4].d_amt1; this.Record.d17 = this.Record.DetList[4].d_amt2;
      this.Record.d06 = this.Record.DetList[5].d_amt1; this.Record.d18 = this.Record.DetList[5].d_amt2;
      this.Record.d07 = this.Record.DetList[6].d_amt1; this.Record.d19 = this.Record.DetList[6].d_amt2;
      this.Record.d08 = this.Record.DetList[7].d_amt1; this.Record.d20 = this.Record.DetList[7].d_amt2;
      this.Record.d09 = this.Record.DetList[8].d_amt1; this.Record.d21 = this.Record.DetList[8].d_amt2;
      this.Record.d10 = this.Record.DetList[9].d_amt1; this.Record.d22 = this.Record.DetList[9].d_amt2;
      this.Record.d11 = this.Record.DetList[10].d_amt1; this.Record.d23 = this.Record.DetList[10].d_amt2;
      this.Record.d12 = this.Record.DetList[11].d_amt1; this.Record.d24 = this.Record.DetList[11].d_amt2;
      this.Record.d25 = 0;
    }
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.sal_emp_id == this.Record.sal_emp_id);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.sal_emp_code = this.Record.sal_emp_code;
      REC.sal_emp_name = this.Record.sal_emp_name;
      REC.a01 = this.Record.a01;
      REC.a02 = this.Record.a02;
      REC.a03 = this.Record.a03;
      REC.a04 = this.Record.a04;
      REC.a05 = this.Record.a05;
      REC.a06 = this.Record.a06;
      REC.a07 = this.Record.a07;
      REC.a08 = this.Record.a08;
      REC.a09 = this.Record.a09;
      REC.a10 = this.Record.a10;
      REC.a11 = this.Record.a11;
      REC.a12 = this.Record.a12;
      REC.a13 = this.Record.a13;
      REC.a14 = this.Record.a14;
      REC.a15 = this.Record.a15;
      REC.a16 = this.Record.a16;
      REC.a17 = this.Record.a17;
      REC.a18 = this.Record.a18;
      REC.a19 = this.Record.a19;
      REC.a20 = this.Record.a20;
      REC.a21 = this.Record.a21;
      REC.a22 = this.Record.a22;
      REC.a23 = this.Record.a23;
      REC.a24 = this.Record.a24;
      REC.a25 = this.Record.a25;
      REC.d01 = this.Record.d01;
      REC.d02 = this.Record.d02;
      REC.d03 = this.Record.d03;
      REC.d04 = this.Record.d04;
      REC.d05 = this.Record.d05;
      REC.d06 = this.Record.d06;
      REC.d07 = this.Record.d07;
      REC.d08 = this.Record.d08;
      REC.d09 = this.Record.d09;
      REC.d10 = this.Record.d10;
      REC.d11 = this.Record.d11;
      REC.d12 = this.Record.d12;
      REC.d13 = this.Record.d13;
      REC.d14 = this.Record.d14;
      REC.d15 = this.Record.d15;
      REC.d16 = this.Record.d16;
      REC.d17 = this.Record.d17;
      REC.d18 = this.Record.d18;
      REC.d19 = this.Record.d19;
      REC.d20 = this.Record.d20;
      REC.d21 = this.Record.d21;
      REC.d22 = this.Record.d22;
      REC.d23 = this.Record.d23;
      REC.d24 = this.Record.d24;
      REC.d25 = this.Record.d25;
      REC.sal_gross_earn = this.Record.sal_gross_earn;
      REC.sal_gross_deduct = this.Record.sal_gross_deduct;
      REC.sal_net = this.Record.sal_net;
      REC.sal_pay_date = this.Record.sal_pay_date;
    }
  }


  OnBlur(field: string) {
    if (field == 'sal_pf_limit') {
      this.Record.sal_pf_limit = this.gs.roundNumber(this.Record.sal_pf_limit, 2);
      this.FindNetAmt();
    }
    if (field == 'sal_is_esi') {
      this.FindNetAmt();
    }
    //if (field == 'sal_head') {
    //  this.Record.sal_head = this.Record.sal_head.toUpperCase();
    //}
  }

  OnFocusTableCell(field: string, fieldid: string, colindex: number) {
    if (field == "EARN" && colindex == 1) {
      var REC = this.Record.DetList.find(rec => rec.e_code1 == fieldid);
      if (REC != null) {
        this.bChanged = false;
      }
    }
    if (field == "EARN" && colindex == 2) {
      var REC = this.Record.DetList.find(rec => rec.e_code2 == fieldid);
      if (REC != null) {
        this.bChanged = false;
      }
    }
    if (field == "DEDUCT" && colindex == 1) {
      var REC = this.Record.DetList.find(rec => rec.d_code1 == fieldid);
      if (REC != null) {
        this.bChanged = false;
      }
    }
    if (field == "DEDUCT" && colindex == 2) {
      var REC = this.Record.DetList.find(rec => rec.d_code2 == fieldid);
      if (REC != null) {
        this.bChanged = false;
      }
    }
  }

  OnChangeTableCell(field: string, fieldid: string, colindex: number) {
    if (field == "EARN" && colindex == 1) {
      var REC = this.Record.DetList.find(rec => rec.e_code1 == fieldid);
      if (REC != null) {
        this.bChanged = true;
      }
    }
    if (field == "EARN" && colindex == 2) {
      var REC = this.Record.DetList.find(rec => rec.e_code2 == fieldid);
      if (REC != null) {
        this.bChanged = true;
      }
    }
    if (field == "DEDUCT" && colindex == 1) {
      var REC = this.Record.DetList.find(rec => rec.d_code1 == fieldid);
      if (REC != null) {
        this.bChanged = true;
      }
    }
    if (field == "DEDUCT" && colindex == 2) {
      var REC = this.Record.DetList.find(rec => rec.d_code2 == fieldid);
      if (REC != null) {
        this.bChanged = true;
      }
    }
  }

  OnBlurTableCell(field: string, fieldid: string, colindex: number) {
    let TotAmt: number = 0;
    if (this.bChanged == false)
      return;

    if (field == "EARN" && colindex == 1) {
      var REC = this.Record.DetList.find(rec => rec.e_code1 == fieldid);
      if (REC != null) {
        REC.e_amt1 = this.gs.roundNumber(REC.e_amt1, 2);
        this.FindNetAmt();
      }
    }
    if (field == "EARN" && colindex == 2) {
      var REC = this.Record.DetList.find(rec => rec.e_code2 == fieldid);
      if (REC != null) {
        REC.e_amt2 = this.gs.roundNumber(REC.e_amt2, 2);
        this.FindNetAmt();
      }
    }
    if (field == "DEDUCT" && colindex == 1) {
      var REC = this.Record.DetList.find(rec => rec.d_code1 == fieldid);
      if (REC != null) {
        REC.d_amt1 = this.gs.roundNumber(REC.d_amt1, 2);
        this.FindNetAmt();
      }
    }
    if (field == "DEDUCT" && colindex == 2) {
      var REC = this.Record.DetList.find(rec => rec.d_code2 == fieldid);
      if (REC != null) {
        REC.d_amt2 = this.gs.roundNumber(REC.d_amt2, 2);
        this.FindNetAmt();
      }
    }
  }
  Close() {
    this.gs.ClosePage('home');
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }
    return AddressSplit;
  }

  FindNetAmt() {
    let TotEarning: number = 0;
    let TotDeductn: number = 0;

    for (let rec of this.Record.DetList) {
      TotEarning += rec.e_amt1;
      TotEarning += rec.e_amt2;
    }

    for (let rec of this.Record.DetList) {
      TotDeductn += rec.d_amt1;
      TotDeductn += rec.d_amt2;
    }

    TotEarning = this.gs.roundNumber(TotEarning, 0);
    TotDeductn = this.gs.roundNumber(TotDeductn, 0);

    this.Record.sal_gross_earn = TotEarning;
    this.Record.sal_gross_deduct = TotDeductn;
    this.Record.sal_net = (TotEarning - TotDeductn);
  }

  // Query List Data
  Generate(_type: string, generatemodal: any) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.bRemove = true;
    let EmpIds = "";

    if (this.salyear <= 0) {
      this.ErrorMessage += " | Invalid Year";
    } else if (this.salyear < 100) {
      this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
    }
    if (this.salmonth <= 0 || this.salmonth > 12) {
      this.ErrorMessage += " | Invalid Month";
    }

    if (_type == 'SAVE') {
      if (this.RecordList2.length <= 0) {
        alert("No Records Found");
        return;
      }
      for (let rec of this.RecordList2) {
        if (EmpIds != "")
          EmpIds += ",";
        EmpIds += rec.sal_emp_id;
      }
    }

    let SalPkids: string = "";//Main List
    let ListMonth: number = 0;
    for (let rec of this.RecordList) {
      this.bRemove = false; //Payroll exist so cannot delete
      ListMonth = rec.sal_month;
      if (rec.sal_selected) {
        if (SalPkids != "")
          SalPkids += ",";
        SalPkids += rec.sal_pkid;
      }
    }

    if (ListMonth != 0 && ListMonth != this.salmonth) {
      this.ErrorMessage += " | Invalid List, Please Search And Continue.....";
      alert(this.ErrorMessage);
      return;
    }
    if (this.ErrorMessage.length > 0)
      return;

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      salmonth: this.salmonth,
      salyear: this.salyear,
      year_start_date: this.gs.globalVariables.year_start_date,
      year_end_date: this.gs.globalVariables.year_end_date,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      salpkids: SalPkids,
      empids: EmpIds,
      origion: 'PAYROLL-LIST-PAGE'
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.Generate(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "LIST") {
          this.RecordList2 = response.list;//Modal List
          this.open(generatemodal);
        } else {
          this.modal.close();
          this.List('NEW');
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  //ShowEmpList(salgenerate: any) {
  //  this.ErrorMessage = '';
  //  this.InfoMessage = '';
  //  this.open(salgenerate);
  //}
  Save2() {
  }
  Close2() {
    this.modal.close();
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string, _type: string = "") {
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      type: _type,
      pkid: Id,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "PAYROLL") {
          this.RecordList.splice(this.RecordList.findIndex(rec => rec.sal_emp_id == Id), 1);
        } else {
          this.RecordList2.splice(this.RecordList2.findIndex(rec => rec.sal_emp_id == Id), 1);
        }
        alert("Removed Successfully");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  folder_id: string;
  PrintSalarySheet(_type: string = '', _filetype: string = '') {
    this.ErrorMessage = ''
    let SalPkids: string = "";
    let empbrgrp: number = 0;
    let ismultigrp: boolean = false;
    for (let rec of this.RecordList.filter(rec => rec.sal_selected == true)) {
      if (SalPkids != "")
        SalPkids += ",";
      SalPkids += rec.sal_pkid;
      if (empbrgrp <= 0)
        empbrgrp = rec.sal_emp_branch_group;
      if (empbrgrp != rec.sal_emp_branch_group)
        ismultigrp = true;
    }

    if (_type == "SALSHEET") {
      if (ismultigrp) {
        this.ErrorMessage = "Please Select Single Group and Continue.....";
        alert(this.ErrorMessage);
        return;
      }
    }

    if (_type == "PAYSLIP") {
      if (SalPkids == "") {
        this.ErrorMessage = "Please Select and Continue.....";
        alert(this.ErrorMessage);
        return;
      }
    }

    if (_filetype == 'CSV') {
      if (!confirm("Confirm all the staff need to be included before proceed payment.")) {
        return;
      }
    }

    if (empbrgrp <= 0)
      empbrgrp = 1;

    this.loading = true;
    this.folder_id = this.gs.getGuid();
    let SearchData = {
      type: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: '',
      year_code: '',
      salmonth: 0,
      salyear: 0,
      empstatus: '',
      isadmin: 'N',
      filetype: 'PDF',
      empbrgroup: 1,
      psadmin: 'N',
      ssadmin: 'N',
      csvamt: this.csvamt,
      allbranch: this.allbranch
    }

    SearchData.type = _type;
    SearchData.pkid = SalPkids;
    SearchData.salmonth = this.salmonth;
    SearchData.salyear = this.salyear;
    SearchData.empstatus = this.empstatus;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.folderid = this.folder_id;
    SearchData.isadmin = this.bAdmin ? "Y" : "N";
    SearchData.filetype = _filetype;
    SearchData.empbrgroup = empbrgrp;
    SearchData.psadmin = (this.bapprovalstatus.indexOf('PS-ADMIN') >= 0 || this.gs.globalVariables.user_code == "ADMIN") ? 'Y' : 'N';
    SearchData.ssadmin = (this.bapprovalstatus.indexOf('SS-ADMIN') >= 0 || this.gs.globalVariables.user_code == "ADMIN") ? 'Y' : 'N';
    SearchData.csvamt = this.gs.isBlank(this.csvamt) ? '0' : this.csvamt;
    SearchData.allbranch = this.allbranch;

    this.ErrorMessage = '';
    this.mainService.PrintSalarySheet(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.FileList = response.filelist;
        if (this.gs.isBlank(this.FileList)) {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          if (response.filename2.length > 0)
            this.Downloadfile(response.filename2, response.filetype2, response.filedisplayname2);
          if (response.filename3.length > 0)
            this.Downloadfile(response.filename3, response.filetype3, response.filedisplayname3);
        } else {
          for (let rec of this.FileList) {
            this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
          }
        }
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

  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.RecordList) {
      rec.sal_selected = this.selectdeselect;
    }
  }

  Mail(_type: string) {
    let Msg: string = "";
    let SalPkids: string = "";
    for (let rec of this.RecordList.filter(rec => rec.sal_selected == true)) {
      if (SalPkids != "")
        SalPkids += ",";
      SalPkids += rec.sal_pkid;
    }

    if (_type == "PAYSLIP-ALL") {
      let str: string = "";
      if (this.empstatus == "BOTH")
        str = "Employees";
      else if (this.empstatus == "CONFIRMED")
        str = "Confirmed Employees";
      else if (this.empstatus == "UNCONFIRM")
        str = "Unconfirmed Employees";
      else if (this.empstatus == "APPRENTICE")
        str = "Apprentice";
      else
        str = "Consultant";
      Msg = "Send Payslip to ALL " + str + " of " + this.gs.globalVariables.branch_name;
      if (SalPkids != "")
        Msg = "Send Payslip to Selected  " + str + "  of " + this.gs.globalVariables.branch_name;
      if (!confirm(Msg)) {
        return;
      }
    }


    this.loading = true;

    let eSearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      email_type: _type,
      report_folder: this.gs.globalVariables.report_folder,
      salmonth: this.salmonth,
      salyear: this.salyear,
      empstatus: this.empstatus,
      salpkid: SalPkids
    };


    this.ErrorMessage = '';
    this.gs.SendEmail(eSearchData)
      .subscribe(response => {
        this.loading = false;

        if (_type == "PAYSLIP-ALL") {
          if (response.retvalue)
            alert('Mail Sending Completed Successfully');
          else
            alert(response.error);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  PostJV() {
    let Msg: string = "";
    Msg = "Generate PAYROLL JV";
    if (this.salh_jvno > 0)
      Msg = "Re-Generate PAYROLL JV";
    if (!confirm(Msg)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      year_prefix: this.gs.globalVariables.year_prefix,
      year_start_date: this.gs.globalVariables.year_start_date,
      year_end_date: this.gs.globalVariables.year_end_date,
      sal_year: this.salyear,
      sal_month: this.salmonth,
      report_folder: this.gs.globalVariables.report_folder
    };


    this.ErrorMessage = '';

    this.mainService.PostPayRoll(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.salh_jvno = response.jvno;
        this.salh_jvno_ho = response.jvno_ho;
        alert('Payroll JV Generated : ' + response.msg);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }


  PostPFJV() {
    let Msg: string = "";
    Msg = "Generate PF JV";
    if (this.pf_jvno > 0)
      Msg = "Re-Generate PF JV";


    if (this.salyear < 2020 && this.salmonth < 5) {
      alert('Invalid Payroll Year And Month');
      return;
    }

    if (!confirm(Msg)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      year_prefix: this.gs.globalVariables.year_prefix,
      year_start_date: this.gs.globalVariables.year_start_date,
      year_end_date: this.gs.globalVariables.year_end_date,
      sal_year: this.salyear,
      sal_month: this.salmonth,
      report_folder: this.gs.globalVariables.report_folder
    };


    this.ErrorMessage = '';

    this.mainService.PostPFJV(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.pf_jvno = response.jvno;
        this.pf_jvno_ho = response.jvno_ho;
        alert('PF JV Generated : ' + response.msg);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  PostLWFJV() {
    let Msg: string = "";
    Msg = "Generate LWF JV";
    if (this.lwf_jvno > 0)
      Msg = "Re-Generate LWF JV";


    if (this.salyear < 2020 && this.salmonth < 5) {
      alert('Invalid Payroll Year And Month');
      return;
    }

    if (!confirm(Msg)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      year_prefix: this.gs.globalVariables.year_prefix,
      year_start_date: this.gs.globalVariables.year_start_date,
      year_end_date: this.gs.globalVariables.year_end_date,
      sal_year: this.salyear,
      sal_month: this.salmonth,
      report_folder: this.gs.globalVariables.report_folder
    };


    this.ErrorMessage = '';

    this.mainService.PostLWFJV(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.lwf_jvno = response.jvno;
        alert('LWF JV Generated : ' + response.jvno);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  DownloadPaySlip( _rec:Salarym) {
   
    if (!confirm("Do you want to Download Payslip of " + _rec.sal_emp_name + ", Dated " + _rec.sal_date)) {
      return;
    }

    let eSearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      salmonth: _rec.sal_month,
      salyear: this.salyear,
      empstatus: this.empstatus,
      salpkid: _rec.sal_pkid
    };

    this.ErrorMessage = '';
    this.mainService.PayslipDownload(eSearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  Removepayroll(_salid: string, _empnam: string, _saldate: string) {
    if (!confirm("Do you want to Delete Payroll of " + _empnam + ", Dated " + _saldate)) {
      return;
    }
    this.RemoveRecord(_salid, "PAYROLL");
  }

  ShowPayDate(_salid: string, paydate: any) {
    this.payment_date_all = false;
    this.payment_date_pkid = _salid;
    var REC = this.RecordList.find(rec => rec.sal_pkid == this.payment_date_pkid);
    if (REC != null) {
      this.payment_date_remark = REC.sal_emp_name;
    }
    this.open(paydate);
  }

  UpdatePayDate() {

    this.loading = true;

    let SearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      sal_year: this.salyear,
      sal_month: this.salmonth,
      payment_date: this.payment_date,
      sal_pkid: this.payment_date_pkid,
      payment_date_all: this.payment_date_all
    };


    this.ErrorMessage = '';
    this.mainService.UpdatePaymentDate(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retval == true) {
          if (this.payment_date_all) {
            for (let rec of this.RecordList) {
              rec.sal_pay_date = response.paydate;
            }
          } else {
            var REC = this.RecordList.find(rec => rec.sal_pkid == this.payment_date_pkid);
            if (REC != null) {
              REC.sal_pay_date = response.paydate;
            }
          }
          this.modal.close();
        }
        //alert('Save Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  DeductionsList(deductmodal: any) {
    this.ErrorMessage = '';
    if (this.salyear <= 0) {
      this.ErrorMessage += " | Invalid Year";
    } else if (this.salyear < 100) {
      this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
    }
    if (this.salmonth <= 0 || this.salmonth > 12) {
      this.ErrorMessage += " | Invalid Month";
    }
    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    let SearchData = {
      type: 'LIST',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      report_folder: this.gs.globalVariables.report_folder,
      salyear: this.salyear,
      salmonth: this.salmonth,
      searchstring: '',
      empid: this.Record.sal_emp_id
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeductionList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList3 = response.list;//Modal List
        this.open(deductmodal);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  UpdateDeduction() {

    if (this.RecordList3.length <= 0) {
      alert("No Records Found");
      return;
    }
    let Rec: Deductm = new Deductm;
    Rec.ded_sal_pkid = this.pkid;
    Rec.ded_emp_id = this.Record.sal_emp_id;
    Rec.dedList = this.RecordList3;
    Rec._globalvariables = this.gs.globalVariables;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.UpdateDeduction(Rec)
      .subscribe(response => {
        this.loading = false;
        this.Close2();
        this.GetRecord(this.pkid);
        // alert('Save Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  ShowDocuments(doc: any) {
    this.docpkid = this.Record.sal_emp_id.toString() + this.Record.sal_year.toString().substring(2) + this.Record.sal_month.toString();
    this.ErrorMessage = '';
    this.open(doc);
  }
}
