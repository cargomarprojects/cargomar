import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Trackingm } from '../models/tracking';
import { TrackingService } from '../services/tracking.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AutoCompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { DateComponent } from '../../shared/date/date.component';


@Component({
    selector: 'app-transittrackingrpt',
    templateUrl: './transittrackingrpt.component.html',
    providers: [TrackingService]
})
export class TransitTrackingRptComponent {
    // Local Variables 
    title = 'Tracking List';

    //@ViewChild('VesselLov') private VesselLov: ElementRef;
    //   @ViewChild('VesselLov') private VesselLov: AutoCompleteComponent;
    //   @ViewChild('trk_pol_etd') private trk_pol_etd: DateComponent;
    //   @ViewChild('trk_pod_eta') private trk_pod_eta: DateComponent;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    selectedRowIndex: number = -1;
    from_date: string = '';
    to_date: string = '';
    Total_Amount: number = 0;
    sub: any;
    urlid: string;

    bPrint = false;
    loading = false;
    currentTab = 'LIST';
    vesseltype = 'AIR CARRIER';
    porttype = 'SEA PORT';
    bChanged: boolean;
    trk_confirm: boolean = false;
    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';
    ctr: number;
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;
    // Array For Displaying List
    RecordList: Trackingm[] = [];
    // Single Record for add/edit/view details
    Record: Trackingm = new Trackingm;

    constructor(
        private mainService: TrackingService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 15;
        this.page_current = 0;
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });
    }



    InitComponent() {
        this.from_date = this.gs.defaultValues.lastmonthdate;
        this.to_date = this.gs.defaultValues.today;
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }
        if (this.type == "AIR EXPORT") {
            this.vesseltype = 'AIR CARRIER';
            this.porttype = 'AIR PORT';
        } else {
            this.vesseltype = 'VESSEL';
            this.porttype = 'SEA PORT';
        }
        this.InitLov();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {

    }


    List(_type: string) {

        // if (this.from_date.trim().length <= 0) {
        //     this.ErrorMessage = 'From Date Cannot Be Blank';
        //     return;
        // }
        // if (this.to_date.trim().length <= 0) {
        //     this.ErrorMessage = 'To Date Cannot Be Blank';
        //     return;
        // }
        // if (_type == 'EXCEL') {
        //     if (this.RecordList.length <= 0) {
        //         this.ErrorMessage = 'List Not Found.';
        //         return;
        //     }
        // }
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            parentid: this.parentid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            from_date: this.from_date,
            to_date: this.to_date,
            trk_confirm: this.trk_confirm,
            report_folder: this.gs.globalVariables.report_folder
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.TransitTrackingList(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
    Close() {
        this.gs.ClosePage('home');
    }


    OnBlur(field: string) {
        var oldChar = / /gi;//replace all blank space in a string
        switch (field) {

            case 'trk_voyage':
                {
                    this.Record.trk_voyage = this.Record.trk_voyage.toUpperCase().trim();
                    break;
                }
        }
    }
}
