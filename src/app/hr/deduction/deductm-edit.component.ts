import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Deductm } from '../models/deductm';
import { DeductmService } from '../services/deductm.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SalaryHead } from '../models/salaryhead';
import { TaxplanDetService } from '../services/taxplandet.service';

@Component({
    selector: 'app-deductm-edit',
    templateUrl: './deductm-edit.component.html',
    providers: [DeductmService]
})
export class DeductmEditComponent {
    // Local Variables 
    title = 'DEDUCTIONS';

    @Input() menuid: string = '';
    @Input() pkid: string = '';
    @Input() btncaption: string = 'New'; //link
    @Output() callbackevent = new EventEmitter<any>();

    InitCompleted: boolean = false;
    menu_record: any;

    bChanged: boolean;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    bPrint: boolean = false;
    searchstring = '';
    modal: any;

    mode: string = 'EDIT';
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
        private modalService: NgbModal,
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
        this.Record.ded_emp_id = '';
        this.Record.ded_emp_code = '';
        this.Record.ded_emp_name = '';
        this.Record.ded_type = '';
        this.Record.ded_start_date = this.gs.defaultValues.today;
        this.Record.ded_paid_amt = 0;
        this.Record.ded_mon_amt = 0;
        this.Record.ded_tot_months = 0;

        this.Record.ded_edit_code = "{S}";
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
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
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
                // this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                if (this.callbackevent != null)
                    this.callbackevent.emit({ saction: 'SAVE', rec: this.Record });
                // this.ActionHandler("ADD", '');
                this.modal.close();
            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.Record.ded_emp_code.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Employee Cannot Be Blank";
        }

        if (this.Record.ded_type.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Deduction Type Cannot Be Blank";
        }

        if (this.Record.ded_start_date.trim().length <= 0) {
            bret = false;
            sError = " | Date Cannot Be Blank";
        }

        if (this.Record.ded_paid_amt == 0 && this.Record.ded_mon_amt == 0) {
            bret = false;
            sError += "\n\r | Invalid  Amount ";
        }

        if (bret === false) {
            // this.ErrorMessage = sError;
            alert(sError);
        }
        if (bret) {

        }
        return bret;
    }




    OnBlur(field: string) {
        if (field == 'ded_paid_amt') {
            this.Record.ded_paid_amt = this.gs.roundNumber(this.Record.ded_paid_amt, 2);
            this.FindInstallments();
        }
        if (field == 'ded_mon_amt') {
            this.Record.ded_mon_amt = this.gs.roundNumber(this.Record.ded_mon_amt, 2);
            this.FindInstallments();
        }
        if (field == 'ded_tot_months') {
            this.Record.ded_tot_months = this.gs.roundNumber(this.Record.ded_tot_months, 0);
        }
        // if (field == 'sal_head') {
        //  this.Record.sal_head = this.Record.sal_head.toUpperCase();
        // }
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

    FindInstallments() {

        let Totmons: number = 0;
        if (this.Record.ded_mon_amt > 0)
            Totmons = this.Record.ded_paid_amt / this.Record.ded_mon_amt;
        Totmons = this.gs.roundNumber(this.Record.ded_paid_amt / this.Record.ded_mon_amt, 0);
        this.Record.ded_tot_months = Totmons;
    }

    Close() {
        if (this.callbackevent != null)
            this.callbackevent.emit({ saction: 'CLOSE' });
        this.modal.close();
    }

    ShowModal(_deductm: any) {
        this.currentTab = 'DETAILS';
        if (this.gs.isBlank(this.pkid))
            this.mode = 'ADD';
        else
            this.mode = 'EDIT';
        this.open(_deductm);
    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }
}
