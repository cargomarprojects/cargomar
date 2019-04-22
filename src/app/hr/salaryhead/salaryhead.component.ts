import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SalaryHead } from '../models/salaryhead';
import { SalaryHeadService } from '../services/salaryhead.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-salaryhead',
  templateUrl: './salaryhead.component.html',
  providers: [SalaryHeadService]
})
export class SalaryHeadComponent {
    // Local Variables 
    title = 'SALARY HEAD MASTER';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

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
    
    mode = '';
    pkid = '';
    
    // Array For Displaying List
    RecordList: SalaryHead[] = [];
    // Single Record for add/edit/view details
    Record: SalaryHead = new SalaryHead;
    ACCRECORD: SearchTable = new SearchTable();

    constructor(
      private mainService: SalaryHeadService,
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
      this.ACCRECORD = new SearchTable();
      this.ACCRECORD.controlname = "ACCTM";
      this.ACCRECORD.displaycolumn = "CODE";
      this.ACCRECORD.type = "ACCTM";
      this.ACCRECORD.id = "";
      this.ACCRECORD.code = "";
      this.ACCRECORD.name = "";
  
    }
    LovSelected(_Record: SearchTable) {
      if (_Record.controlname == "ACCTM") {
        this.Record.sal_acc_id = _Record.id;
        this.Record.sal_acc_code = _Record.code;
        this.Record.sal_acc_name = _Record.name;
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
            });
    }

    NewRecord() {
      this.pkid = this.gs.getGuid();
      this.Record = new SalaryHead();
      this.Record.sal_pkid = this.pkid;
      this.Record.sal_code = '';
      this.Record.sal_desc = '';
      this.Record.sal_head = '';
      this.Record.sal_head_order = 0;
      this.Record.sal_acc_id ='';
      this.Record.sal_acc_code ='';
      this.Record.sal_acc_name ='';
      this.InitLov();
      this.Record.rec_mode = this.mode;
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
            });
    }

    LoadData(_Record: SalaryHead) {
        this.Record = _Record;
        this.InitLov();
        this.ACCRECORD.id = this.Record.sal_acc_id;
        this.ACCRECORD.code = this.Record.sal_acc_code;
        this.ACCRECORD.name = this.Record.sal_acc_name;
    
        this.Record.rec_mode = this.mode;
    }

    // Save Data
    Save() {
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

      if (this.Record.sal_code.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Code Cannot Be Blank";
      }

      if (this.Record.sal_desc.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Description Cannot Be Blank";
      }

      if (this.Record.sal_head_order <= 0) {
        bret = false;
        sError += "\n\r | Invalid  order ";
      }
      
      
      if (bret === false)
        this.ErrorMessage = sError;
      return bret;
    }

    RefreshList() {
      if (this.RecordList == null)
        return;
      var REC = this.RecordList.find(rec => rec.sal_pkid == this.Record.sal_pkid);
      if (REC == null) {
        this.RecordList.push(this.Record);
      }
      else {
        REC.sal_code = this.Record.sal_code;
        REC.sal_desc = this.Record.sal_desc;
        REC.sal_head_order = this.Record.sal_head_order;
        REC.sal_head = this.Record.sal_head;
        REC.sal_acc_code = this.Record.sal_acc_code;
        REC.sal_acc_name = this.Record.sal_acc_name;
      } 
    }
    

    OnBlur(field: string) {
      if (field == 'sal_code') {
        this.Record.sal_code = this.Record.sal_code.toUpperCase();
      }
      if (field == 'sal_desc') {
        this.Record.sal_desc = this.Record.sal_desc.toUpperCase();
      }
      if (field == 'sal_head') {
        this.Record.sal_head = this.Record.sal_head.toUpperCase();
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
}
