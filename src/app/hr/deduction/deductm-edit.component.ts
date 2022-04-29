import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Deductm } from '../models/deductm';
import { DeductmService } from '../services/deductm.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SalaryHead } from '../models/salaryhead';

@Component({
    selector: 'app-deductm-edit',
    templateUrl: './deductm-edit.component.html',
    providers: [DeductmService]
})
export class DeductmEditComponent {
    // Local Variables 
    title = 'DEDUCTION MASTER';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() mode: string = '';
    @Input() pkid: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
     

    bChanged: boolean;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    bPrint: boolean = false;
    searchstring = '';

     

    sub: any;
    urlid: string;
    lock_record: boolean = false;
     

    ErrorMessage = "";
    InfoMessage = "";
    
    // Array For Displaying List
    Salheadlist: SalaryHead[] = [];
    // Single Record for add/edit/view details
    Record: Deductm = new Deductm;
    
    EMPRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: DeductmService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
         
         
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
    }

    InitComponent() {
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }
        this.InitLov();
        this.LoadCombo();
    }

    LoadCombo() {

        this.loading = true;
        let SearchData = {
          type: 'type',
          comp_code: this.gs.globalVariables.comp_code,
          branch_code: this.gs.globalVariables.branch_code
        };
    
        SearchData.comp_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
    
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
          .subscribe(response => {
            this.loading = false;
            this.Salheadlist = response.salheadlist;
            this.ActionHandler(this.mode, this.pkid)
          },
            error => {
              this.loading = false;
              this.ErrorMessage = this.gs.getError(error);
            });
      }
    
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
         
    }

    InitLov() {
        this.EMPRECORD = new SearchTable();
        this.EMPRECORD.controlname = "EMPLOYEE";
        this.EMPRECORD.displaycolumn = "CODE";
        this.EMPRECORD.type = "EMPLOYEE";
        this.EMPRECORD.where = "";
        this.EMPRECORD.id = ""
        this.EMPRECORD.code = "";
        this.EMPRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "EMPLOYEE") {
            this.Record.ded_emp_id = _Record.id;
            this.Record.ded_emp_code = _Record.code;
            this.Record.ded_emp_name = _Record.name;
        }
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action === 'ADD') {
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

    NewRecord() {
        this.pkid = this.gs.getGuid();
        this.Record = new Deductm();
        this.Record.ded_pkid = this.pkid;
        
        //this.Record.ded_edit_code = "{S}";
        // this.Record.DetList=this.Recorddet;
         
        this.lock_record = false;
        this.InitLov();
        this.Record.rec_mode = this.mode;

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
                });
    }

    LoadData(_Record: Deductm) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        this.InitLov();
        this.EMPRECORD.id = this.Record.ded_emp_id;
        this.EMPRECORD.code = this.Record.ded_emp_code;
        this.EMPRECORD.name = this.Record.ded_emp_name;
        // this.lock_record = true;
        // if (this.Record.ded_edit_code.indexOf("{S}") >= 0)
        //     this.lock_record = false;
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
                // this.RefreshList();
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

     


    OnBlur(field: string) {
        // if (field == 'sal_pf_limit') {
        //     this.Record.sal_pf_limit = this.gs.roundNumber(this.Record.sal_pf_limit, 2);
        //     this.FindNetAmt();
        // }
        // if (field == 'sal_is_esi') {
        //     this.FindNetAmt();
        // }
        //if (field == 'sal_head') {
        //  this.Record.sal_head = this.Record.sal_head.toUpperCase();
        //}
    }
 
     

    FindNetAmt() {
       
        // let TotDeductn: number = 0;
        // for (let rec of this.Record.DetList) {
        //     if (rec.d_code1 == "D01") //Employee PF Deduction
        //         rec.d_amt1 = PF_Amt;
        //     if (rec.d_code1 == "D02")
        //         rec.d_amt1 = ESI_Amt;

        //     TotDeductn += rec.d_amt1;
        //     TotDeductn += rec.d_amt2;
        // }
        // TotDeductn = this.gs.roundNumber(TotDeductn, 0);

        // this.Record.d01 = PF_Amt;
        // this.Record.d02 = ESI_Amt;
        // this.Record.sal_gross_deduct = TotDeductn;
    }
}
