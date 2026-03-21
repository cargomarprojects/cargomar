import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Auditlog } from '../models/auditlog';
import { RepService } from '../services/report.service';
@Component({
    selector: 'app-auditdevice',
    templateUrl: './auditdevice.component.html',
    providers: [RepService]
})
export class AuditDeviceComponent {

    title = 'Device Details';

    @Input() public device_id: string = "";
    @Output() ModifiedRecords = new EventEmitter<any>();

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    sub: any;
    selectedRowIndex = 0;
    search_ip: string = "";
    search_user: string = "";
    from_date: string = "";
    to_date: string = "";

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    RecordList: Auditlog[] = [];
    constructor(
        private mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;
        // URL Query Parameter 
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
        if (!this.gs.isBlank(this.device_id))
            this.List('NEW');
    }

    InitComponent() {
        //if(call from another window dates are blank)
        if (this.gs.isBlank(this.device_id)) {
            this.to_date = this.gs.defaultValues.today;
            this.from_date = this.gs.defaultValues.today;
        } else {
            this.to_date = '';
            this.from_date = '';
        }
        this.LoadCombo();
        this.InitLov();
    }

    InitLov() {


    }
    LovSelected(_Record: SearchTable) {

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }

    LoadCombo() {

    }

    // Save Data
    OnBlur(field: string) {
        switch (field) {
            case 'search_user':
                {
                    this.search_user = this.search_user.trim().toUpperCase();
                    break;
                }
            case 'search_ip':
                {
                    this.search_ip = this.search_ip.trim().toUpperCase();
                    break;
                }
        }
    }
    Close() {

    }

    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            from_date: this.from_date,
            to_date: this.to_date,
            device_id: this.device_id,
            search_ip: this.search_ip,
            search_user: this.search_user,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.mainService.AuditDeviceList(SearchData)
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

}