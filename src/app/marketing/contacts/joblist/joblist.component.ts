import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Jobm } from '../../../clearing/models/job';
import { MarkContactService } from '../../services/markcontacts.service';
@Component({
    selector: 'app-joblist',
    templateUrl: './joblist.component.html',
})
export class JobListComponent {

    title = 'Job Details';

    @Input() public pkid: string = "";
    @Input() public type: string = "";
    @Input() cust_id: string = "";
    @Input() cust_name: string = "";
    @Input() public cust_type: string = "";
    @Input() cust_lock: boolean = false;
    @Output() ModifiedRecords = new EventEmitter<any>();

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    sub: any;
    urlid: string;

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
            this.cust_name = _Record.name;
        }
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }

    LoadCombo() {


    }

    // Save Data
    OnBlur(field: string) {

    }
    Close() {

    }

    List(_type: string) {

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

    ShowFirstJob(_rec: Jobm) {

        if (!confirm("First Job (" + _rec.job_docno + ")?")) {
            return;
        }

        let _vol: number = 0;
        let _volunit: string = 'NA';
        if (_rec.rec_category == "SEA EXPORT" || _rec.rec_category == "SEA IMPORT") {
            _vol = _rec.job_cntr_teu;
            _volunit = 'TEU';
        } else if (_rec.rec_category == "AIR EXPORT" || _rec.rec_category == "AIR IMPORT") {
            _vol = _rec.job_chwt;
            _volunit = 'CHWT';
        }


        this.loading = true;
        let SearchData = {
            cont_pkid: this.pkid,
            job_pkid: _rec.job_pkid,
            job_docno: _rec.job_docno,
            job_date: _rec.job_date,
            volume: _vol,
            unit: _volunit,
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
                if (response.retvalue) {
                    if (this.ModifiedRecords != null)
                        this.ModifiedRecords.emit({ saction: 'SAVE', jobid: _rec.job_pkid, jobno: _rec.job_docno, jobdate: _rec.job_date, volume: _vol, unit: _volunit, custid: this.cust_id, custname: this.cust_name });
                }

            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }
}