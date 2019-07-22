import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AcTransReport } from '../models/actransreport';
import { AcTransReportService } from '../services/actransreport.service';

@Component({
    selector: 'app-actransreport',
    templateUrl: './actrans.report.html',
    providers: [AcTransReportService]
})

export class AcTransComponent {
    title = 'Transcation Report'

    @Input() menuid: string = '';
    @Input() type: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';
    pkid = '';
    rec_category: string = "";
    branch_name: string;
    branch_code: string;


    type_date: string = '';
    from_date: string = '';
    to_date: string = '';
    category: string = '';
    vrnos: string = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    disableSave = true;
    bCompany = false;
    loading = false;

    all: boolean = false;

    currentTab = 'LIST';
    searchstring = '';


    sItems: string = '';

    SearchData = {
        type: '',
        rec_category: '',
        pkid: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        branch_name: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        type_date: '',
        category: '',
        page_count: 0,
        page_current: 0,
        page_rows: 0,
        page_rowcount: 0,
        all: false,
        hide_ho_entries: '',
        vrnos: ''
    };

    // Array For Displaying List
    RecordList: AcTransReport[] = [];
    // Single Record for add/edit/view details
    Record: AcTransReport = new AcTransReport;

    BRRECORD: SearchTable = new SearchTable();


    items: string[] = ['ALL', 'BP', 'BR', 'CI', 'CN', 'CP', 'CR', 'DI', 'DN', 'HO', 'IN', 'IN-ES', 'JV', 'OB', 'OC', 'OI', 'OP', 'PN'];

    myitems : string [] = [];


    constructor(
        private mainService: AcTransReportService,
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

                this.rec_category = this.type;

                this.InitComponent();
            }
        });

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {
        this.category = "ALL";
        this.bCompany = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;

            if (this.menu_record.rights_admin || this.gs.globalVariables.user_code == 'ADMIN' || this.menu_record.rights_approval == 'ALL') 
                this.myitems =  this.items;
            else{

                
                this.myitems =  this.menu_record.rights_approval.split(',');
                if ( this.myitems.length >0 )
                    this.category = this.myitems[0];

            }
        }



        this.Init();
        this.initLov();
        this.LoadCombo();
    }

    Init() {
        this.vrnos = '';
        this.from_date = this.gs.defaultValues.monthbegindate;
        this.to_date = this.gs.defaultValues.today;
        
        this.type_date = "jvh_date";
        this.RecordList = null;
        this.branch_code = this.gs.globalVariables.branch_code;
        this.branch_name = this.gs.globalVariables.branch_name;
        this.page_count = 0;
        this.page_rows = 15;
        this.page_current = 0;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    initLov(caption: string = '') {

        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        this.BRRECORD.code = this.gs.globalVariables.branch_code;
    }

    LovSelected(_Record: SearchTable) {
        // Company Settings
        if (_Record.controlname == "BRANCH") {
            this.branch_code = _Record.code;
            this.branch_name = _Record.name;

        }
    }
    LoadCombo() {
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
    }

    ResetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        if (this.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;

        return this.disableSave;
    }

    // Query List Data
    List(_type: string) {
        this.ErrorMessage = '';
        if (this.vrnos.toUpperCase().indexOf(",") >= 0 && this.vrnos.toUpperCase().indexOf("-") >= 0) {
            this.ErrorMessage += " | Invalid Nos Format, Both Comma And Hyphen together cannot be used.";
        }
        if (this.branch_code.length <= 0) {
            this.ErrorMessage += " | Branch cannot be blank";
        }
        if (this.ErrorMessage.length > 0) {
            alert(this.ErrorMessage);
            return;
        }

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.branch_code = this.branch_code;
        this.SearchData.branch_name = this.branch_name;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.rec_category = this.rec_category;
        //this.SearchData.all = this.all;

        this.SearchData.from_date = this.from_date;
        this.SearchData.to_date = this.to_date;
        this.SearchData.type_date = this.type_date;
        this.SearchData.category = this.category;
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;
        this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        this.SearchData.vrnos = this.vrnos;

        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
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
    Close() {
        this.gs.ClosePage('home');
    }

}
