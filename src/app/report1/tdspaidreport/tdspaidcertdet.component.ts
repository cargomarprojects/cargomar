import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { TdsPaidReport } from '../models/tdspaidreport';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-tdspaidcertdet',
    templateUrl: './tdspaidcertdet.component.html',
    providers: [RepService]
})

export class TdspaidCertDetComponent {
    title = 'Tds Paid Detail Report'

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() pkid: string = '';
    @Input() tan_code: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';

    branch_code: string = '';
    format_type: string = '';
    from_date: string = '';
    to_date: string = '';
    searchstring = '';
    display_format_type: string = '';

    bCompany = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    SearchData = {
        type: '',
        pkid: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        format_type: 'GENERAL',
        all: false,
        tan_code: ''
    };

    // Array For Displaying List
    RecordList: TdsPaidReport[] = [];
    //  Single Record for add/edit/view details
    Record: TdsPaidReport = new TdsPaidReport;

    constructor(
        private mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
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

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
        }
        this.List('GENERAL');
    }

    InitComponent() {
        this.bCompany = false;
        this.format_type = "GENERAL";
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
        }
        this.initLov();
        this.LoadCombo();
        this.Init();
    }

    Init() {

    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    initLov(caption: string = '') {


    }

    LovSelected(_Record: SearchTable) {

    }
    LoadCombo() {
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {

    }

    ResetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        return this.disableSave;
    }

    // // Query List Data
    List(_type: string) {

        this.ErrorMessage = '';
        this.display_format_type = this.format_type;
        this.loading = true;
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.format_type = this.format_type;
        this.SearchData.tan_code = this.tan_code;

        this.ErrorMessage = '';
        this.mainService.TdspaidDetailReport(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.RecordList = null;

    }
    OnBlur(field: string) {
        this.searchstring = this.searchstring.toUpperCase();
    }
    Close() {
        this.gs.ClosePage('home');
    }

}