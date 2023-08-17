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

  selectedRowIndex = 0;

  lock_record: boolean = false;
  bRelived = false;
  bPrint: boolean = false;
  bAdmin: boolean = false;
  chkallselected: boolean = false;
  selectdeselect: boolean = false;
  bChanged: boolean;
  disableSave = true;
  loading = false;
  allbranch: boolean = false;
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
    this.bPrint = false;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      // if (this.menu_record.rights_company)
      //   this.bCompany = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
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

    if (_type == 'CSV')
      if (!confirm("Confirm all the staff need to be included before proceed payment.")) {
        return;
      }

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      company_name: this.gs.globalVariables.comp_name,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      folderid: this.gs.getGuid(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      brelived: this.bRelived,
      allbranch:this.allbranch
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL' || _type == 'CSV' || _type == 'SUMMARY') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          if (!this.gs.isBlank(response.filename2))
            this.Downloadfile(response.filename2, response.filetype2, response.filedisplayname2);
          if (!this.gs.isBlank(response.filename3))
            this.Downloadfile(response.filename3, response.filetype3, response.filedisplayname3);
        }
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
          this.chkallselected = false;
          this.selectdeselect = false;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
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
    this.lock_record = true;
    if (this.Record.bon_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
  }

  // Save Data
  Save(_type: string = "") {
    this.FindNetAmt();
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.bon_save_type = _type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (_type == "UPDATE-ALL") {
           alert('Save Complete');
           for (let rec of this.RecordList) {
            rec.bon_paid_date =  this.gs.ConvertDate2DisplayFormat(this.Record.bon_paid_date);
          }
        } else {
          this.InfoMessage = "Save Complete";
          this.mode = 'EDIT';
          this.Record.rec_mode = this.mode;
          this.RefreshList();
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
      //this.FindNetAmt();
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
      //this.FindNetAmt();
    }

    if (field == 'bon_net_amount') {
      this.Record.bon_net_amount = this.gs.roundNumber(this.Record.bon_net_amount, 2);
      // this.FindNetAmt();
    }

    if (field == 'bon_actual_paid') {
      this.Record.bon_actual_paid = this.gs.roundNumber(this.Record.bon_actual_paid, 2);
      // this.FindNetAmt();
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
    let nBonusAmt: number = 0;
    let nDeductAmt: number = 0;

    nBonusAmt = this.Record.bon_gross_bonus;

    nDeductAmt = this.Record.bon_puja_deduct;
    nDeductAmt += this.Record.bon_interim_deduct;
    nDeductAmt += this.Record.bon_tax_deduct;
    nDeductAmt += this.Record.bon_other_deduct;

    this.Record.bon_tot_deduct = this.gs.roundNumber(nDeductAmt, 0);
    this.Record.bon_net_amount = nBonusAmt - this.Record.bon_tot_deduct;
    this.Record.bon_net_amount = this.gs.roundNumber(this.Record.bon_net_amount, 0);
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

    if (_type == 'SAVE') {
      if (BonEmpids.length <= 0) {
        alert("No Records Selected");
        return;
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
