import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Leavem } from '../models/leavem';
import { LeaveMasterService } from '../services/leavemaster.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-leavemaster',
  templateUrl: './leavemaster.component.html',
  providers: [LeaveMasterService]
})
export class LeaveMasterComponent {
    // Local Variables 
    title = 'LEAVE MASTER DETAILS';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
     
    searchstring = '';
    levyear = 0;
    levmonth = 0;
    tot_pl = 0;

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    lock_record: boolean = false;
    bChanged: boolean = false;
    sub: any;
    urlid: string;
 
    ErrorMessage = "";
    InfoMessage = "";
    
    mode = '';
    pkid = '';
    
    // Array For Displaying List
    RecordList: Leavem[] = [];
    // Single Record for add/edit/view details
    Record: Leavem = new Leavem;
    EMPRECORD: SearchTable = new SearchTable();

    constructor(
      private mainService: LeaveMasterService,
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
        this.levyear = +this.gs.globalVariables.year_code;
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
        this.Record.lev_emp_name  = _Record.name;
      }
    }
     
    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action : string, id :string ) {
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
            report_folder: this.gs.globalVariables.report_folder,
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

                if (_type == 'EXCEL')
                this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else
                {
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
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
    //NewRecord() {
    //  this.pkid = this.gs.getGuid();
    //  this.Record = new Leavem();
    //  this.Record.lev_pkid = this.pkid;
    //  this.Record.lev_emp_id = '';
    //  this.Record.lev_emp_code = '';
    //  this.Record.lev_emp_name = '';
    //  this.Record.lev_year = 0;
    //  this.Record.lev_month = 0;
    //  this.Record.lev_sl = 0;
    //  this.Record.lev_cl = 0;
    //  this.Record.lev_pl = 0;
    //  this.Record.lev_others = 0;
    //  this.Record.lev_lp = 0;
    //  this.Record.lev_holidays = 0;
    //  this.Record.lev_days_worked = 0;
    //  this.Record.lev_pl_carry = 0;
    //  this.Record.lev_fin_year = 0;
    //  if (this.gs.defaultValues.today.trim() != "") {
    //    var tempdt = this.gs.defaultValues.today.split('-');
    //    this.Record.lev_year = +tempdt[0];
    //  }

    //  this.InitLov();
    //  this.Record.rec_mode = this.mode;
    //} 

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
            });
    }

    LoadData(_Record: Leavem) {
        this.Record = _Record;
        this.InitLov();
        this.EMPRECORD.id = this.Record.lev_emp_id;
        this.EMPRECORD.code = this.Record.lev_emp_code;
        this.EMPRECORD.name = this.Record.lev_emp_name;
        this.Record.rec_mode = this.mode;
        this.FindTotPL();

        this.lock_record = true;
        if (this.Record.lev_edit_code.indexOf("{S}") >= 0)
        this.lock_record = false;
    }

    // Save Data
    Save() {
        if (!this.allvalid())
        return;
        this.FindTotPL();
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
      if (this.Record.lev_year <= 0) {
        bret = false;
        sError = "\n\r | Invalid Year ";
      }

      if (this.Record.lev_year != +this.gs.globalVariables.year_code ) {
        bret = false;
        sError += "\n\r | Invalid Year  ";
      }
      
      if (this.Record.lev_emp_id.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Emplyoee Cannot Be Blank";
      }

      if (this.tot_pl > 60) {
        bret = false;
        sError += "\n\r | Total Privilege Leave should be less than or equal to 60";
      }
      
      if (bret === false)
        this.ErrorMessage = sError;
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
        REC.lev_pl_carry = this.Record.lev_pl_carry;
        REC.lev_pl = this.Record.lev_pl;
        REC.lev_cl = this.Record.lev_cl;
        REC.lev_sl = this.Record.lev_sl;
      } 
    }

    OnFocus(field: string) {
      if (field == 'lev_pl' || field == 'lev_pl_carry')
        this.bChanged = false;
    }
    OnChange(field: string) {
      if (field == 'lev_pl' || field == 'lev_pl_carry')
        this.bChanged = true;
    }
    OnBlur(field: string) {
      if (field == 'lev_pl') {
        this.FindTotPL();
      }
      if (field == 'lev_pl_carry') {
        this.FindTotPL();
      }
    }
  
    Close() {
        this.gs.ClosePage('home');
    }

     

    // Query List Data
    Generate() {
      this.ErrorMessage = '';
      this.InfoMessage = '';

      if (this.levyear <= 0) {
        this.ErrorMessage += " | Invalid Year";
      } else if (this.levyear < 100) {
        this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
      }
      if (this.levyear != +this.gs.globalVariables.year_code) {
        this.ErrorMessage += " | Invalid Financial Year";
      }

      if (this.ErrorMessage.length > 0)
        return;

      this.loading = true;
      let SearchData = {
        type: '',
        rowtype: this.type,
        searchstring: this.searchstring.toUpperCase(),
        levyear: this.levyear,
        company_code: this.gs.globalVariables.comp_code,
        branch_code: this.gs.globalVariables.branch_code,
        year_code: this.gs.globalVariables.year_code,
        user_code: this.gs.globalVariables.user_code
      };

      this.ErrorMessage = '';
      this.InfoMessage = '';
      this.mainService.Generate(SearchData)
        .subscribe(response => {
          this.loading = false;
          if (response.error.length <= 0)
            this.List('NEW');
          else {
            this.ErrorMessage = response.error;
            alert(this.ErrorMessage);
          }
        },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
    }
    FindTotPL() {
      this.tot_pl = this.Record.lev_pl + this.Record.lev_pl_carry;
      this.tot_pl = this.gs.roundNumber(this.tot_pl, 1);
    }
}
