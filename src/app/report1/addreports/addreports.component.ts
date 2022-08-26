import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AddReports } from '../models/addreports';
import { AddReportsService } from '../services/addreports.service';
import { DateComponent } from '../../shared/date/date.component';


@Component({
    selector: 'app-addreports',
    templateUrl: './addreports.component.html',
    providers: [AddReportsService]
})

export class AddReportsComponent {
    title = 'Additional Reports'

    @ViewChild('todate') private todate: DateComponent;
    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    modal: any;

    selectedRowIndex = 0;
    ErrorMessage = "";
    mode = '';
    pkid = '';

    type_date: string = 'SOB';
    from_date: string = '';
    to_date: string = '';

    sales_from_date: string = '';
    sales_to_date: string = '';

    bExcel = false;
    bCompany = false;
    bAdmin = false;
    loading = false;
    currentTab = 'LIST';
    searchstring = '';

    SearchData = {
        type: '',
        pkid: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        branch_name: '',
        year_code: '',
        from_date: '',
        to_date: ''
    };

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    AttachList: any[] = [];
    FileList: any[] = [];
    // Array For Displaying List
    RecordList: AddReports[] = [];
    //  Single Record for add/edit/view details
    Record: AddReports = new AddReports;


    constructor(
        private modalService: NgbModal,
        private mainService: AddReportsService,
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
    }

    InitComponent() {
        this.bExcel = false;
        this.bCompany = false;
        this.bAdmin = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_print)
                this.bExcel = true;
        }
        this.Init();
        this.initLov();
        this.LoadCombo();
    }

    Init() {
        this.to_date = this.gs.defaultValues.today;

        var today = new Date();
        var wkday = today.getDate() - today.getDay() + 1;
        var wkStart = new Date(today.setDate(wkday));
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));

        this.to_date = wkStart.toISOString().slice(0, 10);
        this.sales_from_date = wkStart.toISOString().slice(0, 10);
        this.sales_to_date = wkEnd.toISOString().slice(0, 10);
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
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
    }

    ResetControls() {

    }

    // // Query List Data
    List(_type: string, mailsent: any) {

        this.ErrorMessage = '';
        //if (this.from_date.trim().length <= 0) {
        //  this.ErrorMessage = "From Date Cannot Be Blank";
        //  return;
        //}
        //if (this.to_date.trim().length <= 0) {
        //  this.ErrorMessage = "To Date Cannot Be Blank";
        //  return;
        //}

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.type = _type;
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.branch_name = this.gs.globalVariables.branch_name;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.to_date = this.to_date;

        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                // this.Downloadfile(response.filename, response.filetype, response.filedisplayname);

                if (_type == 'MAIL') {
                    this.FileList = response.filelist;
                    this.AttachList = new Array<any>();
                    for (let rec of this.FileList) {
                        this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filesize: rec.filesize });
                    }
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
                    this.open(mailsent);
                }
                else {
                    this.FileList = response.filelist;
                    for (let rec of this.FileList) {
                        this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
                    }
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

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    SalesCallReport(_type: string, mailsent: any) {

        this.ErrorMessage = '';
        if (this.sales_from_date.trim().length <= 0) {
            this.ErrorMessage = "From Date Cannot Be Blank";
            return;
        }
        if (this.sales_to_date.trim().length <= 0) {
            this.ErrorMessage = "To Date Cannot Be Blank";
            return;
        }

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.type = _type;
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.branch_name = this.gs.globalVariables.branch_name;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.from_date = this.sales_from_date;
        this.SearchData.to_date = this.sales_to_date;
        this.ErrorMessage = '';
        this.mainService.SalesCallReport(this.SearchData)
            .subscribe(response => {
                this.loading = false;

                if (_type == 'MAIL') {
                    this.FileList = response.filelist;
                    this.AttachList = new Array<any>();
                    for (let rec of this.FileList) {
                        this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filesize: rec.filesize });
                    }
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
                    this.open(mailsent);
                }
                else {
                    this.FileList = response.filelist;
                    for (let rec of this.FileList) {
                        this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
                    }
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
}
