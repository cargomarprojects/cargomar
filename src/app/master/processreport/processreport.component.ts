import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ProcessReportService } from '../services/processreport.service';
import { SearchTable } from '../../shared/models/searchtable';
import { FileDetails } from '../../operations/models/filedetails';
import { AllReport } from '../models/allreport';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-processreport',
    templateUrl: './processreport.component.html',
    providers: [ProcessReportService]
})
export class ProcessReportComponent {
    // Local Variables 
    title = 'Process Report';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    modal: any;
    selectedRowIndex: number = -1;

    loading = false;

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;
    isAdmin = false;
    bCompany = false;
    sub: any;
    urlid: string;
    // Prealertdate: boolean = false;
    senton_date = "";
    ErrorMessage = "";

    branch_name: string;
    branch_code: string;
    branch_number: number;
    finyear: string;

    RecordList: AllReport[] = [];
    FileList: FileDetails[] = [];
    pkid: string = "";

    constructor(
        private modalService: NgbModal,
        private mainService: ProcessReportService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 10;
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

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {

            this.InitComponent();
        }
    }

    InitComponent() {
        this.finyear = this.gs.globalVariables.year_code;
        this.bCompany = false;
        this.isAdmin = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
            if (this.menu_record.rights_admin)
                this.isAdmin = true;
        }
        this.initLov();
        this.LoadCombo();
        this.branch_code = this.gs.globalVariables.branch_code;
        this.branch_name = this.gs.globalVariables.branch_name;
        this.branch_number = this.gs.globalVariables.branch_number;
        this.List('NEW');
    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    LoadCombo() {
    }

    // Query List Data
    List(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
        };
        this.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    Process(_type: string) {
        this.ErrorMessage = '';
        if (this.finyear.trim().length <= 0) {
            this.ErrorMessage = "\n\r | Financial Year Cannot Be Blank";
            return;
        }

        if (!confirm("Process " + _type)) {
            return;
        }

        this.loading = true;
        this.ErrorMessage = '';
        let SearchData = {
            report_folder: this.gs.globalVariables.report_folder,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            year_code: this.finyear,
            type: _type
        };

        SearchData.report_folder = this.gs.globalVariables.report_folder;
        SearchData.company_code = this.gs.globalVariables.comp_code;
        SearchData.type = _type.toUpperCase();
        SearchData.year_code = this.finyear;

        this.mainService.Process(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.List('NEW');
                alert('Process Complete');
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Close() {
        this.gs.ClosePage('home');
    }


    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }



}
