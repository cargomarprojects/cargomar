import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Jobm } from '../../clearing/models/job';
import { MarkContactService } from '../services/markcontacts.service';
@Component({
    selector: 'app-newbiz',
    templateUrl: './newbiz.component.html',
    providers: [MarkContactService]
})
export class NewBizComponent {

    title = 'Job Details';

    @Input() public pkid: string = "";
    @Input() public type: string = "";
    @Input() public cust_id: string = "";
    @Input() public cust_code: string = "";
    @Input() public cust_name: string = "";
    @Input() public cont_id: string = "";
    @Input() cust_lock: boolean = false;
    @Output() ModifiedRecords = new EventEmitter<any>();

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    sub: any;
    urlid: string;
    cust_gr_name: string = "";
    convertedjob: string = "";


    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    RecordList: Jobm[] = [];
    constructor(
        private mainService: MarkContactService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 5;
        this.page_current = 0;
        // URL Query Parameter 
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.convertedjob = "";
        this.LoadCombo();
    }

    InitComponent() {
        this.InitLov();
    }

    InitLov() {


    }
    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CUST") {
            this.cust_id = _Record.id;
            this.cust_code = _Record.code;
            this.cust_name = _Record.name;
            if (!this.gs.isBlank(this.cust_id))
                this.GetGroupName(this.cust_id);
        }
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }

    LoadCombo() {
        if (!this.gs.isBlank(this.cust_id))
            this.GetGroupName(this.cust_id);
    }

    // Save Data
    OnBlur(field: string) {

    }
    Close() {

    }

    List(_type: string) {

        if (this.gs.isBlank(this.cust_id))
            return;


        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            cust_id: this.cust_id,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.mainService.JobList(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
            }, error => {
                this.loading = false;
                alert(this.gs.getError(error));
            });
    }

    GetGroupName(_custid: string) {

        this.loading = true;
        let SearchData = {
            custid: _custid,
            visit_pkid: this.pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.mainService.GetGroupName(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.cust_gr_name = response.grname;
                this.convertedjob = response.convjobno;
            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }

    ConvertedJob(_rec: Jobm) {

        if (!confirm("Converted Job (" + _rec.job_docno + ")?")) {
            return;
        }

        this.loading = true;
        let SearchData = {
            cont_pkid: this.cont_id,
            visit_pkid: this.pkid,
            job_pkid: _rec.job_pkid,
            job_docno: _rec.job_docno,
            job_date: _rec.job_date,
            category: _rec.rec_category,
            cust_id: this.cust_id,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code
        };

        this.mainService.UpdateJobDetail(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.retmsg)
                    alert(response.retmsg);

                this.convertedjob = _rec.job_docno + "-" + _rec.rec_category;

            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }

    UpdateCustomer() {


        if (!confirm("Update Customer")) {
            return;
        }

        this.loading = true;
        let SearchData = {
            cont_pkid: this.cont_id,
            cust_id: this.cust_id,
            cust_name: this.cust_name,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code
        };

        this.mainService.UpdateCustomer(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.retmsg)
                    alert(response.retmsg);

            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }
}