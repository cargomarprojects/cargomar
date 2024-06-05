import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { ItemJobwork } from '../../models/itemjobwork';
import { ItemJobworkService } from '../../services/itemjobwork.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-itemjobwork',
    templateUrl: './itemjobwork.component.html',
    providers: [ItemJobworkService]
})
export class ItemJobworkComponent {
    // Local Variables 
    title = 'Job Work';

    @ViewChild('je_beno') private je_beno_ctrl: ElementRef;

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
    RecordList: ItemJobwork[] = [];
    // Single Record for add/edit/view details
    Record: ItemJobwork = new ItemJobwork;

    QTYUNITRECORD: SearchTable = new SearchTable();
    PORTRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: ItemJobworkService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

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
        this.QTYUNITRECORD = new SearchTable();
        this.QTYUNITRECORD.controlname = "QTY-UNIT";
        this.QTYUNITRECORD.displaycolumn = "CODE";
        this.QTYUNITRECORD.type = "UNIT";
        this.QTYUNITRECORD.id = "";
        this.QTYUNITRECORD.code = "";
        this.QTYUNITRECORD.name = "";

        this.PORTRECORD = new SearchTable();
        this.PORTRECORD.controlname = "PORT";
        this.PORTRECORD.displaycolumn = "CODE";
        this.PORTRECORD.type = "PORT";
        this.PORTRECORD.id = "";
        this.PORTRECORD.code = "";
        this.PORTRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "QTY-UNIT") {
            this.Record.jw_be_unit_id = _Record.id;
            this.Record.jw_be_unit_code = _Record.code;
            this.Record.jw_be_unit_name = _Record.name;
        }
        if (_Record.controlname == "PORT") {
            this.Record.jw_be_port_id = _Record.id;
            this.Record.jw_be_port_code = _Record.code;
            this.Record.jw_be_port_name = _Record.name;
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
        this.Record = new ItemJobwork();
        this.Record.jw_pkid = this.pkid;
        this.Record.jw_be_no = '';
        this.Record.jw_be_date = '';
        this.Record.jw_be_inv_slno = '';
        this.Record.jw_be_inv_no = '';
        this.Record.jw_be_itm_slno = '';
        this.Record.jw_be_port_id = '';
        this.Record.jw_be_port_code = '';
        this.Record.jw_be_port_name = '';
        this.Record.jw_be_qty = 0;
        this.Record.jw_be_unit_id = '';
        this.Record.jw_be_unit_code = '';
        this.Record.jw_be_unit_name = '';

        this.Record.rec_mode = this.mode;
        this.InitLov();

        this.QTYUNITRECORD.id = this.gs.defaultValues.param_unit_pcs_id;
        this.QTYUNITRECORD.code = this.gs.defaultValues.param_unit_pcs_code;
        this.Record.jw_be_unit_id = this.QTYUNITRECORD.id;
        this.Record.jw_be_unit_code = this.QTYUNITRECORD.code;

        this.je_beno_ctrl.nativeElement.focus();

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

    LoadData(_Record: ItemJobwork) {
        this.Record = _Record;
        this.InitLov();
        this.QTYUNITRECORD.id = this.Record.jw_be_unit_id;
        this.QTYUNITRECORD.code = this.Record.jw_be_unit_code;
        this.QTYUNITRECORD.name = this.Record.jw_be_unit_name;

        this.PORTRECORD.id = this.Record.jw_be_port_id;
        this.PORTRECORD.code = this.Record.jw_be_port_code;
        this.PORTRECORD.name = this.Record.jw_be_port_name;

        this.Record.rec_mode = this.mode;
        this.je_beno_ctrl.nativeElement.focus();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.jw_itm_id = this.parentid;
        this.Record.jw_job_id = this.jobid;
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
        var REC = this.RecordList.find(rec => rec.jw_pkid == this.Record.jw_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.jw_be_no = this.Record.jw_be_no;
            REC.jw_be_date = this.Record.jw_be_date;
            REC.jw_be_inv_slno = this.Record.jw_be_inv_slno;
            REC.jw_be_inv_no = this.Record.jw_be_inv_no;
            REC.jw_be_itm_slno = this.Record.jw_be_itm_slno;
            REC.jw_be_port_name = this.Record.jw_be_port_name;
            REC.jw_be_qty = this.Record.jw_be_qty;
            REC.jw_be_unit_code = this.Record.jw_be_unit_code;
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
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.jw_pkid == this.pkid), 1);
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

            case 'jw_be_no':
                {
                    this.Record.jw_be_no    = this.Record.jw_be_no.toUpperCase();
                    break;
                }
            case 'jw_be_inv_no':
                {
                    this.Record.jw_be_inv_no = this.Record.jw_be_inv_no.toUpperCase();
                    break;
                }
            case 'jw_be_qty':
                {
                    this.Record.jw_be_qty = this.gs.roundWeight(this.Record.jw_be_qty, "PCS");
                    break;
                }
            case 'jw_be_inv_slno':
                {
                    this.Record.jw_be_inv_slno = this.Record.jw_be_inv_slno.toUpperCase();
                    break;
                }
            case 'jw_be_inv_no':
                {
                    this.Record.jw_be_inv_no = this.Record.jw_be_inv_no.toUpperCase();
                    break;
                }
            case 'jw_be_itm_no':
                {
                    this.Record.jw_be_itm_slno = this.Record.jw_be_itm_slno.toUpperCase();
                    break;
                }
        }
    }

}
