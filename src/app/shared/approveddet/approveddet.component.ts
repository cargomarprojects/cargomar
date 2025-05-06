import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { ApprovedDetService } from '../services/approveddet.service';
import { ApprovedDet } from '../models/approveddet';

@Component({
    selector: 'app-approveddet',
    templateUrl: './approveddet.component.html',
    providers: [ApprovedDetService]
})
export class ApprovedDetComponent {
    // Local Variables 
    title = 'Approved List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() approvalstatus: string = '';
    @Input() category: string = 'LEV-APPROVED';
    @Output() ModifiedRecords = new EventEmitter<any>();

    selectedRowIndex: number = -1;

    Total_Amount: number = 0;

    modal: any;

    loading = false;
    currentTab = 'LIST';

    CanDelete = false;
    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;


    // Array For Displaying List
    RecordList: ApprovedDet[] = [];
    // Single Record for add/edit/view details
    Record: ApprovedDet = new ApprovedDet;
    StatusList: any[] = [];

    constructor(
        private modalService: NgbModal,
        private mainService: ApprovedDetService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        if (this.gs.globalVariables.user_code == "ADMIN")
            this.CanDelete = true;
        this.InitLov();
        this.ActionHandler("ADD", null);
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
        this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }
    LoadCombo() {
        let _adStatus: string = "APPROVED,SANCTIONED,REJECTED";
        this.StatusList = new Array<any>();
        if (!this.gs.isBlank(this.approvalstatus)) {
            let rec = new SearchTable();
            var temparr = this.approvalstatus.split(',');
            for (let itm of temparr) {
                if (_adStatus.includes(itm)) {
                    if (this.gs.isBlank(this.Record.ad_status))
                        this.Record.ad_status = itm;
                    rec = new SearchTable();
                    rec.name = itm;
                    this.StatusList.push(rec)
                }
            }
        }
    }
    InitLov() {

    }

    LovSelected(_Record: SearchTable) {

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

    GetRecord(Id: string) {

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
            year_code: this.gs.globalVariables.year_code,
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.showDelete();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    showDelete() {
        if (!this.gs.isBlank(this.RecordList)) {
            for (let rec of this.RecordList) {
                if (rec.rec_created_by == this.gs.globalVariables.user_code) {
                    this.CanDelete = true;
                    break;
                }
            }
        }
    }
    NewRecord() {
        this.pkid = this.gs.getGuid();
        this.Record = new ApprovedDet();
        this.Record.ad_pkid = this.pkid;
        this.Record.rec_category = this.category;
        this.Record.ad_parent_id = this.parentid;
        this.Record.ad_status = '';
        this.Record.ad_remarks = '';
        this.Record.rec_created_by = this.gs.globalVariables.user_code;
        this.Record.rec_created_date = this.gs.defaultValues.today;
        this.Record.rec_mode = this.mode;
        if (!this.gs.isBlank(this.StatusList)) {
            if (this.StatusList.length > 0)
                this.Record.ad_status = this.StatusList[0].name;
        }
        this.InitLov();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.ad_parent_id = this.parentid;
        this.Record.rec_category = this.category;
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.Record.rec_mode = this.mode;
                this.RefreshList();
                this.ActionHandler('ADD', null);
                this.showDelete();
                if (this.ModifiedRecords != null)
                    this.ModifiedRecords.emit({ stype: 'SAVE', sid: this.parentid, approved_by: response.approved_by, sanctioned_by: response.sanctioned_by, rejected_by: response.rejected_by });
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

        if (this.gs.isBlank(this.Record.ad_status)) {
            bret = false;
            sError += "\n\r | Approved Status Cannot be Blank";
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
        var REC = this.RecordList.find(rec => rec.ad_pkid == this.Record.ad_pkid);
        if (REC == null) {
            this.Record.rec_created_date = this.gs.ConvertDate2DisplayFormat(this.Record.rec_created_date);
            this.Record.rec_created_name = this.gs.globalVariables.user_name;
            this.RecordList.push(this.Record);
        }
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
            case 'ad_remarks':
                {
                    this.Record.ad_remarks = this.Record.ad_remarks.toUpperCase();
                    break;
                }
        }
    }




    OnChange2(field: string) {

    }

    RemoveApproval(_ad_pkid: string, _ad_status: string, _statusby: string) {
        if (!confirm("Do you want to Delete Record " + _ad_status + "  by " + _statusby)) {
            return;
        }

        this.loading = true;
        let SearchData = {
            rowtype: this.type,
            type: '',
            pkid: _ad_pkid,
            parentid: this.parentid,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            ad_status: _ad_status,
            category: this.category
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.ad_pkid == _ad_pkid), 1);
                if (this.ModifiedRecords != null)
                    this.ModifiedRecords.emit({ stype: 'DELETE', sid: this.parentid, approved_by: response.approved_by, sanctioned_by: response.sanctioned_by, rejected_by: response.rejected_by });
                alert("Removed Successfully");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });

    }


}
