import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Bonusm } from '../models/Bonusm';
import { BonusService } from '../services/bonus.service';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  providers: [BonusService]
})
export class BonusComponent {
  // Local Variables 
  title = 'Bonus';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  chkallselected: boolean = false;
  selectdeselect: boolean = false;
  bChanged: boolean;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  modal: any;
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
  RecordList: Bonusm[] = [];
  RecordList2: Bonusm[] = [];
  // Single Record for add/edit/view details
  Record: Bonusm = new Bonusm;

  constructor(
    private modalService: NgbModal,
    private mainService: BonusService,
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
  ActionHandler(action: string, id: string) {
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
        this.chkallselected = false;
        this.selectdeselect = false;
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
      pkid: Id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: Bonusm) {
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
    }
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.bon_pkid == this.Record.bon_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.bon_emp_code = this.Record.bon_emp_code;
      REC.bon_emp_name = this.Record.bon_emp_name;
      REC.bon_days_worked = this.Record.bon_days_worked;
      REC.bon_gross_wages = this.Record.bon_gross_wages;
      REC.bon_gross_bonus = this.Record.bon_gross_bonus;
      REC.bon_puja_deduct = this.Record.bon_puja_deduct;
      REC.bon_interim_deduct = this.Record.bon_interim_deduct;
      REC.bon_tax_deduct = this.Record.bon_tax_deduct;
      REC.bon_other_deduct = this.Record.bon_other_deduct;
      REC.bon_tot_deduct = this.Record.bon_tot_deduct;
      REC.bon_net_amount = this.Record.bon_net_amount;
      REC.bon_actual_paid = this.Record.bon_actual_paid;
      REC.bon_paid_date = this.Record.bon_paid_date;
      REC.bon_remarks = this.Record.bon_remarks;
    }
  }


  OnBlur(field: string) {
    if (field == 'bon_gross_wages') {
      this.Record.bon_gross_wages = this.gs.roundNumber(this.Record.bon_gross_wages, 2);
      this.FindNetAmt();
    }
    if (field == 'bon_gross_bonus') {
      this.Record.bon_gross_bonus = this.gs.roundNumber(this.Record.bon_gross_bonus, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_puja_deduct') {
      this.Record.bon_puja_deduct = this.gs.roundNumber(this.Record.bon_puja_deduct, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_interim_deduct') {
      this.Record.bon_interim_deduct = this.gs.roundNumber(this.Record.bon_interim_deduct, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_tax_deduct') {
      this.Record.bon_tax_deduct = this.gs.roundNumber(this.Record.bon_tax_deduct, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_other_deduct') {
      this.Record.bon_other_deduct = this.gs.roundNumber(this.Record.bon_other_deduct, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_tot_deduct') {
      this.Record.bon_tot_deduct = this.gs.roundNumber(this.Record.bon_tot_deduct, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_net_amount') {
      this.Record.bon_net_amount = this.gs.roundNumber(this.Record.bon_net_amount, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_actual_paid') {
      this.Record.bon_actual_paid = this.gs.roundNumber(this.Record.bon_actual_paid, 2);
      this.FindNetAmt();
    }

    if (field == 'bon_remarks') {
      this.Record.bon_remarks = this.Record.bon_remarks.toUpperCase();
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

    // this.Record.sal_esi_emply_per = this.gs.defaultValues.esi_emply_percent;
    // this.Record.sal_pf_per = this.gs.defaultValues.pf_percent;
    // for (let rec of this.Record.DetList) {
    //   TotEarning += rec.e_amt1;
    //   TotEarning += rec.e_amt2;

    //   if (this.gs.defaultValues.pf_col_excluded.toString().indexOf(rec.e_code1) >= 0)
    //     PF_ExcludedAmt += rec.e_amt1;
    //   if (this.gs.defaultValues.pf_col_excluded.toString().indexOf(rec.e_code2) >= 0)
    //     PF_ExcludedAmt += rec.e_amt2;
    // }


    // PF_BaseAmt = this.Record.sal_pf_limit;//Special pf Entered against employee
    // if (PF_BaseAmt <= 0)
    //   PF_BaseAmt = (TotEarning - PF_ExcludedAmt) > this.gs.defaultValues.pf_limit ? this.gs.defaultValues.pf_limit : (TotEarning - PF_ExcludedAmt);

    // PF_Amt = PF_BaseAmt * (this.gs.defaultValues.pf_percent / 100);
    // PF_Amt = this.gs.roundNumber(PF_Amt, 0);

    // ESI_Amt = 0
    // if (TotEarning <= this.gs.defaultValues.esi_limit || this.Record.sal_is_esi)
    //   ESI_Amt = Math.ceil((TotEarning * (this.gs.defaultValues.esi_emply_percent / 100)));

    // for (let rec of this.Record.DetList) {
    //   if (rec.d_code1 == "D01") //Employee PF Deduction
    //     rec.d_amt1 = PF_Amt;
    //   if (rec.d_code1 == "D02")
    //     rec.d_amt1 = ESI_Amt;

    //   TotDeductn += rec.d_amt1;
    //   TotDeductn += rec.d_amt2;
    // }

    // TotEarning = this.gs.roundNumber(TotEarning, 0);
    // TotDeductn = this.gs.roundNumber(TotDeductn, 0);

    // this.Record.d01 = PF_Amt;
    // this.Record.d02 = ESI_Amt;
    // this.Record.sal_gross_earn = TotEarning;
    // this.Record.sal_gross_deduct = TotDeductn;
    // this.Record.sal_net = (TotEarning - TotDeductn);
  }
  Generate(_type: string, generatemodal: any) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_type == 'SAVE') {
      if (this.RecordList2.length <= 0) {
        alert("No Records Found");
        return;
      }
    }

    let BonEmpids: string = "";//Main List
    for (let rec of this.RecordList2) {
      if (rec.bon_selected) {
        if (BonEmpids != "")
          BonEmpids += ",";
        BonEmpids += rec.bon_emp_id;
      }
    }

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      bonempids: BonEmpids
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
    this.modal = this.modalService.open(content);
  }
  Close2() {
    this.modal.close();
  }
  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.RecordList2) {
      rec.bon_selected = this.selectdeselect;
    }
  }
}
