import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { BlSurrender } from '../models/blsurrender';
import { BlSurrenderService } from '../services/blsurrender.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AutoCompleteMultiComponent } from '../../shared/autocompletemulti/autocompletemulti.component';

@Component({
    selector: 'app-blsurrender',
    templateUrl: './blsurrender.component.html',
    providers: [BlSurrenderService]
})
export class BlSurrenderComponent {
    // Local Variables 
    title = 'BL Surrender List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() agentcode: string = '';
    @Input() mailho: boolean = false;
    @Input() mailagent: boolean = false;
    @Output() ModifiedRecords = new EventEmitter<any>();

    @ViewChild('BlLov') private BlLovMulti: AutoCompleteMultiComponent;
    selectedRowIndex: number = -1;

    loading = false;
    currentTab = 'LIST';
    modal: any;
    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';
    sWhere = "";
    historyType = "";
    ctr: number;

    // Array For Displaying List
    RecordList: BlSurrender[] = [];
    // Single Record for add/edit/view details
    Record: BlSurrender = new BlSurrender;



    constructor(
        private modalService: NgbModal,
        private mainService: BlSurrenderService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.sWhere = "hbl_mbl_id='" + this.parentid + "'";
        this.sWhere += " and hbl_pkid not in (";
        this.sWhere += " select bls_type_id from bl_surrender a ";
        this.sWhere += " where bls_mbl_id='" + this.parentid + "' and nvl(bls_type,'')='HBL'";
        this.sWhere += " ) ";

        this.List("NEW");
        this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "BRANCH") {
            this.Record.bls_type_id = _Record.id;
            this.Record.bls_type_code = _Record.code;
            this.Record.bls_type_name = _Record.name;
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
    }

    ResetControls() {

    }

    List(_type: string) {
        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            mblid: this.parentid,
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
        this.Record = new BlSurrender();
        this.Record.bls_pkid = this.pkid;
        this.Record.bls_type_id = '';
        this.Record.bls_type_code = '';
        this.Record.bls_type_name = '';
        this.Record.rec_mode = this.mode;
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
    }

    // Save Data
    Save() {
        if (!this.gs.isBlank(this.BlLovMulti))
            this.BlLovMulti.Close();
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.bls_mbl_id = this.parentid;
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.InfoMessage = "Save Complete";
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

        if (this.gs.isBlank(this.Record.bls_pkid)) {
            bret = false;
            sError += "\n| Invalid ID ";
        }
        if (this.gs.isBlank(this.Record.bls_type_id)) {
            bret = false;
            sError += "\n| Please select HBL to Surrender ";
        }

        if (bret === false) {
            // this.ErrorMessage = sError;
            alert(sError);
        }
        return bret;
    }

    RefreshList() {

        // if (this.RecordList == null)
        //   return;
        // var REC = this.RecordList.find(rec => rec.pack_pkid == this.Record.pack_pkid);
        // if (REC == null) {
        //   this.RecordList.push(this.Record);
        // }
        // else {
        //   REC.pack_from = this.Record.pack_from;
        //   REC.pack_to = this.Record.pack_to;
        //   REC.pack_type_code = this.Record.pack_type_code;
        //   REC.pack_ctns = this.Record.pack_ctns;
        // }
    }

    DeleteRecord(_rec: BlSurrender) {
        let sremark = "";
        if (!confirm("Delete HBL" + _rec.bls_type_name)) {
            return;
        }

        sremark = "MAIL STATUS BR:" + _rec.bls_br_mail_status;
        sremark += ", MAIL STATUS HO:" + _rec.bls_ho_mail_status;

        this.loading = true;
        let SearchData = {
            pkid: _rec.bls_pkid,
            mblid: _rec.bls_mbl_id,
            hblno: _rec.bls_type_name,
            remarks: sremark,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.bls_pkid == _rec.bls_pkid), 1);
                alert("Removed Successfully");
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

    }

    OnChange(field: string) {

    }

    OnBlur(field: string) {
        //switch (field) {

        //  case 'ord_exp_name':
        //    {
        //      this.Record.ord_exp_name = this.Record.ord_exp_name.toUpperCase();
        //      break;
        //    }

        //}
    }
    BLSurrenderMail(_type: string) {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: 'BL-SURRENDER-MAIL', type: _type });
    }

    History(_type: string, _history: any) {
        this.historyType = _type;
        this.open(_history);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }
}
