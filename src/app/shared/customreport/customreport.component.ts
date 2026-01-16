import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { CustomReportService } from '../services/customreport.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SearchTable } from '../../shared/models/searchtable';
import { CustomReportH, CustomReportD } from '../models/customreporth';

@Component({
    selector: 'app-customreport',
    templateUrl: './customreport.component.html'
})
export class CustomReportComponent implements OnInit {

    public errorMessage: string = '';

    private _type: string = '';
    @Input() set type(value: string) {
        this._type = value;
    }

    public _fieldList: CustomReportD[] = [];
    @Input() set fieldList(value: CustomReportD[]) {
        this._fieldList = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    title = 'User Master';
    loading = false;
    selectedRowIndex = 0;

    modal: any;
    mode = '';
    pkid = '';
    chkallselected: boolean = true;
    selectdeselect: boolean = true;
    selectedformat: string = '';
    // Array For Displaying List
    RecordList: CustomReportH[] = [];
    // Single Record for add/edit/view details
    Record: CustomReportH = new CustomReportH;

    RecordDet: CustomReportD[] = [];
    RecDet: CustomReportD = new CustomReportD;

    constructor(
        private modalService: NgbModal,
        private http2: HttpClient,
        private mainservice: CustomReportService,
        private gs: GlobalService) {

    }

    ngOnInit() {
        this.List('NEW');
    }

    ShowReport(rptmodal: any = null) {
        if (this.gs.isBlank(this._type)) {
            alert('Invalid Type');
            return;
        }
        if (this.gs.isBlank(this._fieldList)) {
            alert('Data List not found');
            return;
        }
        this.List('NEW');
        this.open(rptmodal);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    CloseModal() {
        this.modal.close();
    }

    InitLov() {



    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "SALESMAN") {
            // this.Record.user_sman_id = _Record.id;
            // this.Record.user_sman_code = _Record.code;
            // this.Record.user_sman_name = _Record.name;
        }

    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.errorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
        }
        else if (action === 'ADD') {
            this.mode = 'ADD';
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.mode = 'EDIT';
            this.pkid = id;
            this.GetRecord(id);
        }
    }

    // Query List Data
    List(_ltype: string) {

        this.loading = true;
        let SearchData = {
            type: _ltype,
            rowtype: this._type,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            report_folder: this.gs.globalVariables.report_folder
        };

        this.errorMessage = '';
        this.mainservice.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.selectedRowIndex = 0;
                if (this.RecordList && this.RecordList.length > 0) {
                    this.selectedformat = this.RecordList[0].rh_report_format;
                }
                this.ActionHandler('ADD', '');
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getError(error);
                    alert(this.errorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }


    NewRecord() {
        this.selectdeselect = true;
        this.chkallselected = true;
        this.pkid = this.gs.getGuid();
        this.Record = new CustomReportH();
        this.Record.rh_pkid = this.pkid;
        this.Record.rh_report_format = '';
        this.Record.rh_report_source = this._type;
        this.Record.rec_mode = this.mode;
        // clone array + objects
        this.Record.recordDet = this._fieldList.map(f => ({ ...f }));
        for (let _rec of this.Record.recordDet) {
            _rec.rd_pkid = this.gs.getGuid();
        }
        this.InitLov();
    }


    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id
        };

        this.errorMessage = '';
        this.mainservice.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);

            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getError(error);
                    alert(this.errorMessage);
                });
    }

    LoadData(_Record: CustomReportH) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        const existing = new Set(
            this.Record.recordDet.map(r => r.rd_field)
        );
        for (const field of this._fieldList) {
            if (!existing.has(field.rd_field)) {
                this.Record.recordDet.push({
                    ...field,
                    rd_selected: false
                }); // clone ,override rd_selected ONLY in clone
            }
        }
        this.Record.recordDet.sort((a, b) => a.rd_ctr - b.rd_ctr);
        this.InitLov();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.errorMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainservice.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.errorMessage = "Save Complete";
                // alert(this.errorMessage);
                this.RefreshList();
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getError(error);
                    alert(this.errorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.errorMessage = '';
        if (this.Record.rh_report_format.trim().length <= 0) {
            bret = false;
            sError = "Format Cannot Be Blank";
        }
        let bSelected = false;
        for (let _rec of this.Record.recordDet) {
            if (_rec.rd_selected) {
                bSelected = true;
                break;
            }
        }
        if (!bSelected) {
            bret = false;
            sError += " | No rows selected";
        }

        if (bret === false) {
            this.errorMessage = sError;
            alert(this.errorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;

        var REC = this.RecordList.find(rec => rec.rh_pkid == this.Record.rh_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
            this.selectedRowIndex = this.RecordList.length - 1;
        }
        else {
            REC.rh_report_format = this.Record.rh_report_format;
        }


    }

    ModifiedRecords(params: any) {

        if (params.saction == "SAVE") {

        }
        this.modal.close();
    }

    OnBlur(field: string) {

        if (field == 'rh_report_format') {
            this.Record.rh_report_format = this.Record.rh_report_format.toUpperCase();
        }

    }


    RemoveFormat(_rh_pkid: string, _rh_format: string) {

        if (!confirm("Do you want to Delete Format " + _rh_format)) {
            return;
        }
        this.loading = true;
        let SearchData = {
            rowtype: this._type,
            pkid: _rh_pkid,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
        };
        this.errorMessage = '';
        this.mainservice.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.rh_pkid == _rh_pkid), 1);
                // alert("Removed Successfully");
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getError(error);
                    alert(this.errorMessage);
                });
    }

    changeChkChecked(_rec: CustomReportD) {
        _rec.rd_selected = !_rec.rd_selected;
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.Record.recordDet) {
            rec.rd_selected = this.selectdeselect;
        }
        this.chkallselected = this.selectdeselect;
    }
}