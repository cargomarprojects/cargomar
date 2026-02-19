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

    @Input() public RecordList: Jobm[] = [];
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


}