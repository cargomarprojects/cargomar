import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { ItemReExport } from '../../models/itemreexport';
import { ItemReExportService } from '../../services/itemreexport.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-itemreexport',
    templateUrl: './itemreexport.component.html',
    providers: [ItemReExportService]
})
export class ItemReExportComponent {
    // Local Variables 
    title = 'ReExport';

    @ViewChild('_re_serial_no') private re_serial_no_ctrl: ElementRef;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() jobid: string = '';

    selectedRowIndex: number = -1;

    Total_Amount: number = 0;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    // Array For Displaying List
    RecordList: ItemReExport[] = [];
    // Single Record for add/edit/view details
    Record: ItemReExport = new ItemReExport;

    constructor(
        private mainService: ItemReExportService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        //this.List("NEW");
        //this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = changedProp.previousValue;
            if (propName == 'parentid') {
                this.List("NEW");
                this.ActionHandler("ADD", null);
            }
        }
    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "UNIT") {
            this.Record.re_be_uqc_id = _Record.id;
            this.Record.re_be_uqc_code = _Record.code;
        }
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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
            this.selectedRowIndex = _selectedRowIndex;
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
        }
        else if (action === 'REMOVE') {
            this.currentTab = 'DETAILS';
            this.pkid = id;
            this.RemoveRecord(id);
        }
    }

    ResetControls() {

    }

    List(_type: string) {
        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            parentid: this.parentid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new ItemReExport();
        this.Record.re_pkid = this.pkid;
        this.Record.re_serial_no = 0;
        this.Record.re_be_site = '';
        this.Record.re_be_no = 0;
        this.Record.re_be_date = '';
        this.Record.re_be_invoice_no = 0;
        this.Record.re_be_item = 0;
        this.Record.re_be_manual = 'N';
        this.Record.re_be_qty_utilised = 0;
        this.Record.re_be_itm_desc = '';
        this.Record.re_be_qty = 0;
        this.Record.re_be_uqc_id = '';
        this.Record.re_be_uqc_code = '';
        this.Record.re_be_assessed_val = 0;
        this.Record.re_be_duty_paid = 0;
        this.Record.re_be_duty_pay_date = '';
        this.Record.re_be_oth_ident_param = '';
        this.Record.re_be_assessable_valclaim = 0;
        this.Record.re_be_item_used = 'N';
        this.Record.re_commisioner_permission = 'N';
        this.Record.re_input_credit = 'N';
        this.Record.re_personal_used = 'N';
        this.Record.re_modvat_availed = 'N';
        this.Record.re_modvat_repaid = 'N';
        this.Record.re_be_technical_det = '';
        this.Record.re_obligation = 'N';
        this.Record.re_obligation_no = '';
        this.Record.re_board_no = '';
        this.Record.re_board_date = '';
        
        this.Record.rec_mode = this.mode;
        this.InitLov();

        if (!this.gs.isBlank(this.re_serial_no_ctrl))
            this.re_serial_no_ctrl.nativeElement.focus();

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

    LoadData(_Record: ItemReExport) {
        this.Record = _Record;
        this.InitLov();
        this.Record.rec_mode = this.mode;
        if (!this.gs.isBlank(this.re_serial_no_ctrl))
            this.re_serial_no_ctrl.nativeElement.focus();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.re_itm_id = this.parentid;
        this.Record.re_job_id = this.jobid;
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.RefreshList();
                this.ActionHandler('ADD', null);
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

        if (this.parentid.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Item ID Cannot Be Blank";
        }

        if (this.jobid.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Job ID Cannot Be Blank";
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
        var REC = this.RecordList.find(rec => rec.re_pkid == this.Record.re_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.re_serial_no = this.Record.re_serial_no;
            REC.re_be_no = this.Record.re_be_no;
            REC.re_be_date = this.Record.re_be_date;
            REC.re_be_invoice_no = this.Record.re_be_invoice_no;
            REC.re_be_item = this.Record.re_be_item;
            REC.re_be_manual = this.Record.re_be_manual;
            REC.re_be_itm_desc = this.Record.re_be_itm_desc;
            REC.re_be_qty = this.Record.re_be_qty;
            REC.re_be_uqc_code = this.Record.re_be_uqc_code;
        }
    }

    RemoveList(event: any) {
        if (event.selected) {
            this.ActionHandler('REMOVE', event.id)
        }
    }
    RemoveRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            parentid: this.parentid
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.re_pkid == this.pkid), 1);
                this.ActionHandler('ADD', null);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }


    Close() {
        this.gs.ClosePage('home');
    }

    OnFocus(field: string) {
        this.bChanged = false;
    }

    OnChange(field: string) {
        this.bChanged = true;

    }

    OnBlur(field: string) {
        switch (field) {

            case 're_be_site':
                {
                    this.Record.re_be_site = this.Record.re_be_site.toUpperCase();
                    break;
                }
            case 're_be_itm_desc':
                {
                    this.Record.re_be_itm_desc = this.Record.re_be_itm_desc.toUpperCase();
                    break;
                }
            case 're_be_oth_ident_param':
                {
                    this.Record.re_be_oth_ident_param = this.Record.re_be_oth_ident_param.toUpperCase();
                    break;
                }
            case 're_be_qty_utilised':
                {
                    this.Record.re_be_qty_utilised = this.gs.roundNumber(this.Record.re_be_qty_utilised, 6);
                    break;
                }
            case 're_be_qty':
                {
                    this.Record.re_be_qty = this.gs.roundNumber(this.Record.re_be_qty, 6);
                    break;
                }
            case 're_be_assessed_val':
                {
                    this.Record.re_be_assessed_val = this.gs.roundNumber(this.Record.re_be_assessed_val, 6);
                    break;
                }
            case 're_be_duty_paid':
                {
                    this.Record.re_be_duty_paid = this.gs.roundNumber(this.Record.re_be_duty_paid, 2);
                    break;
                }
            case 're_be_assessable_valclaim':
                {
                    this.Record.re_be_assessable_valclaim = this.gs.roundNumber(this.Record.re_be_assessable_valclaim, 2);
                    break;
                }
            case 're_be_technical_det':
                {
                    this.Record.re_be_technical_det = this.Record.re_be_technical_det.toUpperCase();
                    break;
                }
            case 're_obligation_no':
                {
                    this.Record.re_obligation_no = this.Record.re_obligation_no.toUpperCase();
                    break;
                }
             
        }
    }

}
