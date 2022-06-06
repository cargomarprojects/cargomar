import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AcTransReport } from '../models/actransreport';
import { AcTransReportService } from '../services/actransreport.service';

@Component({
    selector: 'app-transdetreport',
    templateUrl: './transdet.report.html',
    providers: [AcTransReportService]
})

export class TransDetComponent {
    /*
Ajith 22/05/19 -DeleteRecord modified to delete single row

*/
    title = 'Transaction Details'

    @Input() menuid: string = '';
    @Input() type: string = '';

    CloseCaption = 'Return';
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    pkid = '';

    bCompany = false;
    loading = false;

    currentTab = 'LIST';
    searchstring = '';

    narration: '';

    SearchData = {
        pkid: '',
        company_code: '',
        branch_code: '',
        branch_name: '',
        acc_code: '',
        searchstring: '',
        jvh_year: '',
        jvh_type: '',
        jvh_vrno: ''
    };

    // Array For Displaying List
    RecordList: AcTransReport[] = [];
    // Single Record for add/edit/view details
    Record: AcTransReport = new AcTransReport;

    RecordXrefList: AcTransReport[] = [];

    BRRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: AcTransReportService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.SearchData.company_code = options.company_code;
                this.SearchData.branch_code = options.branch_code;
                this.SearchData.acc_code = options.acc_code;
                this.SearchData.jvh_year = options.jvh_year;
                this.SearchData.jvh_type = options.jvh_type;
                this.SearchData.jvh_vrno = options.jvh_vrno;
                this.List('NEW');
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
    }

    InitComponent() {
        this.bCompany = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
        }
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    // Query List Data
    List(_type: string) {

        this.ErrorMessage = '';

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;

        this.ErrorMessage = '';
        this.mainService.TransDetList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.narration = response.narration;
                this.RecordXrefList = response.xreflist;
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.narration = '';
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    Close() {
        let IsCloseButton = this.CloseCaption == 'Close' ? true : false;
        this.gs.ClosePage('home', IsCloseButton);
    }

    RemoveList(event: any) {
        if (event.selected) {
            this.DeleteRecord("ROW-DELETE", event.id);
        }
    }

    DeleteRecord(_type: string, _id: string) {
        this.ErrorMessage = '';
        let jvhid: string = "";
        let xrefPkid: string = "";
        let jvh_pkid: string = "";

        for (let rec of this.RecordList) {
            jvh_pkid = rec.jvh_pkid;
            break;
        }

        if (_type == "FULL-DELETE") {

            if (this.RecordXrefList.length <= 0) {
                this.ErrorMessage = "No List Found";
                return;
            }

            for (let rec of this.RecordXrefList) {
                jvhid = rec.jvh_pkid;
                break;
            }

            if (jvhid.length <= 0)
                return;

            if (!confirm("Do you want to Delete")) {
                return;
            }
        }
        if (_type == "ROW-DELETE") {
            xrefPkid = _id;
            if (xrefPkid.length <= 0)
                return;
        }

        this.loading = true;
        let SearchData = {
            type: _type,
            pkid: _type == "FULL-DELETE" ? jvhid : xrefPkid,
            jvh_pkid: jvh_pkid,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            user_pkid: this.gs.globalVariables.user_pkid
        };

        this.ErrorMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == "ROW-DELETE") {
                    this.RecordXrefList.splice(this.RecordXrefList.findIndex(rec => rec.xref_pkid == _id), 1);
                } else {
                    this.ErrorMessage = "Delete Complete";
                    alert(this.ErrorMessage);
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

}
