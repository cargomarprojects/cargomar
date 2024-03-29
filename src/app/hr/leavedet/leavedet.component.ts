import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Leavem } from '../models/leavem';
import { LeaveDetService } from '../services/leavedet.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-leavedet',
  templateUrl: './leavedet.component.html',
  providers: [LeaveDetService]
})
export class LeaveDetComponent {
  // Local Variables 
  title = 'LEAVE DETAILS';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  levyear = 0;
  levmonth = 0;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  lock_record: boolean = false;
  lock_sal_record: boolean = false;
  bChanged: boolean = false;
  sub: any;
  urlid: string;
  bJoinRelieve: boolean = false;

  porttype = 'PORT';

  ErrorMessage = "";
  InfoMessage = "";
  // emp_status = "CONFIRMED";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: Leavem[] = [];
  // Single Record for add/edit/view details
  Record: Leavem = new Leavem;
  EMPRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: LeaveDetService,
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
    this.LoadCombo();
    if (this.gs.defaultValues.today.trim() != "") {
      var tempdt = this.gs.defaultValues.today.split('-');
      this.levyear = +tempdt[0];
      this.levmonth = +tempdt[1];
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
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
    //    this.StatusList = response.statuslist;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = this.gs.getError(error);
    //  });

    this.List("NEW");
  }


  InitLov() {
    this.EMPRECORD = new SearchTable();
    this.EMPRECORD.controlname = "EMPLOYEE";
    this.EMPRECORD.displaycolumn = "CODE";
    this.EMPRECORD.type = "EMPLOYEE";
    this.EMPRECORD.where = "";
    this.EMPRECORD.id = "";
    this.EMPRECORD.code = "";
    this.EMPRECORD.name = "";
  }
  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "EMPLOYEE") {
      this.Record.lev_emp_id = _Record.id;
      this.Record.lev_emp_code = _Record.code;
      this.Record.lev_emp_name = _Record.name;
      this.Record.rec_category = _Record.col1;
      // this.emp_status = _Record.col1;
      if (this.Record.rec_category == 'CONFIRMED' || this.Record.rec_category == 'TRANSFER') {
        if (this.Record.lev_year > 0 && this.Record.lev_month > 0) {
          var nDate = new Date(this.Record.lev_year, this.Record.lev_month, 0)
          this.Record.lev_days_worked = nDate.getDate();
          this.Record.lev_lp = 0;
        }
      }
      this.IsJoinRelieve();
    }
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
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
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
      levmonth: this.levmonth,
      levyear: this.levyear,
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
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new Leavem();
    this.Record.lev_pkid = this.pkid;
    this.Record.lev_emp_id = '';
    this.Record.lev_emp_code = '';
    this.Record.lev_emp_name = '';
    this.Record.lev_year = 0;
    this.Record.lev_month = 0;
    this.Record.lev_sl = 0;
    this.Record.lev_cl = 0;
    this.Record.lev_pl = 0;
    this.Record.lev_others = 0;
    this.Record.lev_lp = 0;
    this.Record.lev_holidays = 0;
    this.Record.lev_days_worked = 0;
    this.Record.lev_pl_carry = 0;
    this.Record.lev_fin_year = 0;
    this.Record.rec_category = 'CONFIRMED';
    this.lock_record = false;
    this.lock_sal_record = false;
    if (this.gs.defaultValues.today.trim() != "") {
      var tempdt = this.gs.defaultValues.today.split('-');
      this.Record.lev_year = +tempdt[0];
      this.Record.lev_month = +tempdt[1];
    }

    this.InitLov();
    this.Record.rec_mode = this.mode;
    this.FindDaysWorked();
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
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: Leavem) {
    this.Record = _Record;
    this.InitLov();
    this.EMPRECORD.id = this.Record.lev_emp_id;
    this.EMPRECORD.code = this.Record.lev_emp_code;
    this.EMPRECORD.name = this.Record.lev_emp_name;
    this.Record.rec_mode = this.mode;

    this.lock_record = true;
    if (this.Record.lev_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;

    this.lock_sal_record = true;
    if (this.Record.sal_edit_code.indexOf("{S}") >= 0)
      this.lock_sal_record = false;
  }

  // Save Data
  Save() {
    this.FindDaysWorked();

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
          alert(this.ErrorMessage);

        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.lev_year <= 0) {
      bret = false;
      sError = "\n\r | Invalid Year ";
    }

    if (this.Record.lev_month <= 0 || this.Record.lev_month > 12) {
      bret = false;
      sError += "\n\r | Invalid Month  ";
    }

    if (this.Record.lev_emp_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Emplyoee Cannot Be Blank";
    }

    if (this.Record.lev_days_worked < 0) {
      bret = false;
      sError = "\n\r | Days worked cannot be less than Zero ";
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.lev_pkid == this.Record.lev_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.lev_emp_code = this.Record.lev_emp_code;
      REC.lev_emp_name = this.Record.lev_emp_name;
      REC.lev_year = this.Record.lev_year;
      REC.lev_month = this.Record.lev_month;
      REC.lev_pl = this.Record.lev_pl;
      REC.lev_cl = this.Record.lev_cl;
      REC.lev_sl = this.Record.lev_sl;
      REC.lev_lp = this.Record.lev_lp;
    }
  }

  OnFocus(field: string) {
    if (field == 'lev_year' || field == 'lev_month')
      this.bChanged = false;
  }
  OnChange(field: string) {
    if (field == 'lev_year' || field == 'lev_month')
      this.bChanged = true;
  }
  OnBlur(field: string) {
    if (field == 'lev_year') {
      this.FindHolidays();
    }
    if (field == 'lev_month') {
      this.FindHolidays();
    }
    if (field == 'lev_lp') {
      this.FindDaysWorked();
    }
    if (field == 'lev_days_worked') {
      this.FindLpDays();
    }
  }
  FindDaysWorked() {
    if (this.bJoinRelieve)
      return;
    if (this.Record.lev_year > 0 && this.Record.lev_month > 0) {
      var nDate = new Date(this.Record.lev_year, this.Record.lev_month, 0);
      this.Record.lev_days_worked = nDate.getDate();
      this.Record.lev_days_worked -= this.Record.lev_lp;
    }
  }
  FindLpDays() {
    if (this.bJoinRelieve)
      return;
    if (this.Record.lev_year > 0 && this.Record.lev_month > 0) {
      var nDate = new Date(this.Record.lev_year, this.Record.lev_month, 0);
      this.Record.lev_lp = nDate.getDate();
      this.Record.lev_lp -= this.Record.lev_days_worked;
    }
  }
  FindHolidays() {
    if (this.bChanged == false)
      return;

    if (this.Record.lev_year > 0 && this.Record.lev_month > 0) {

      var nDate = new Date(this.Record.lev_year, this.Record.lev_month, 0);//Will set last date of previousmonth

      let nDaysInMnth: number = 0;
      nDaysInMnth = nDate.getDate();

      let totSundays: number = 0;
      for (var i = 1; i <= nDaysInMnth; i++) {
        nDate = new Date(this.Record.lev_year, this.Record.lev_month - 1, i);
        if (nDate.getDay() == 0) {
          totSundays++;
        }
      }
      this.Record.lev_holidays = totSundays;
      this.Record.lev_days_worked = nDaysInMnth;
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

  IsJoinRelieve() {
    this.loading = true;
    let SearchData = {
      levempid: this.Record.lev_emp_id,
      levmonth: this.Record.lev_month,
      levyear: this.Record.lev_year
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.IsJoinRelieve(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.bJoinRelieve = response.joinrelieve;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
}
