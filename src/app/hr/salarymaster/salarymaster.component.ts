import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Salarym } from '../models/salarym';
import { SalDet } from '../models/salarym';
import { SalaryMasterService } from '../services/salarymaster.service';
  

@Component({
  selector: 'app-salarymaster',
  templateUrl: './salarymaster.component.html',
  providers: [SalaryMasterService]
})
export class SalaryMasterComponent {
  // Local Variables 
  title = 'SALARY MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  bChanged: boolean;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  porttype = 'PORT';

  ErrorMessage = "";
  InfoMessage = "";

  SalDetails: any[] = [];
  mode = '';
  pkid = '';
  // Array For Displaying List
  RecordList: Salarym[] = [];
  // Single Record for add/edit/view details
  Record: Salarym = new Salarym;
  Recorddet: SalDet = new SalDet;

  constructor(
    private mainService: SalaryMasterService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 30;
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
    this.InitLov();
    this.List("NEW");
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
      this.GetRecord(empid);
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

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
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
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  
  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      empid: Id,
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
      });
  }

  LoadData(_Record: Salarym) {
    this.Record = _Record;
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }

  // Save Data
  Save() {
    this.FindNetAmt();
    if (!this.allvalid())
      return;
    this.loading = true;
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
    let PF_BaseAmt: number = 0;
    let PF_Amt: number = 0;
    let PF_ExcludedAmt: number = 0;//HRA (A04) not included in PF Calculation
    let ESI_Amt: number = 0;

    this.Record.sal_esi_emply_per = this.gs.defaultValues.esi_emply_percent;
    this.Record.sal_pf_per = this.gs.defaultValues.pf_percent;
    for (let rec of this.Record.DetList) {
      TotEarning += rec.e_amt1;
      TotEarning += rec.e_amt2;

      if (this.gs.defaultValues.pf_col_excluded.toString().indexOf(rec.e_code1) >= 0)
        PF_ExcludedAmt += rec.e_amt1;
      if (this.gs.defaultValues.pf_col_excluded.toString().indexOf(rec.e_code2) >= 0)
        PF_ExcludedAmt += rec.e_amt2;
    }


    PF_BaseAmt = this.Record.sal_pf_limit;//Special pf Entered against employee
    if (PF_BaseAmt <= 0)
      PF_BaseAmt = (TotEarning - PF_ExcludedAmt) > this.gs.defaultValues.pf_limit ? this.gs.defaultValues.pf_limit : (TotEarning - PF_ExcludedAmt);

    PF_Amt = PF_BaseAmt * (this.gs.defaultValues.pf_percent / 100);
    PF_Amt = this.gs.roundNumber(PF_Amt, 0);

    ESI_Amt = 0
    if (TotEarning <= this.gs.defaultValues.esi_limit || this.Record.sal_is_esi)
      ESI_Amt = Math.ceil((TotEarning * (this.gs.defaultValues.esi_emply_percent / 100)));

    for (let rec of this.Record.DetList) {
      if (rec.d_code1 == "D01") //Employee PF Deduction
        rec.d_amt1 = PF_Amt;
      if (rec.d_code1 == "D02")
        rec.d_amt1 = ESI_Amt;

      TotDeductn += rec.d_amt1;
      TotDeductn += rec.d_amt2;
    }

    TotEarning = this.gs.roundNumber(TotEarning, 0);
    TotDeductn = this.gs.roundNumber(TotDeductn, 0);

    this.Record.d01 = PF_Amt;
    this.Record.d02 = ESI_Amt;
    this.Record.sal_gross_earn = TotEarning;
    this.Record.sal_gross_deduct = TotDeductn;
    this.Record.sal_net = (TotEarning - TotDeductn);
  }
}
