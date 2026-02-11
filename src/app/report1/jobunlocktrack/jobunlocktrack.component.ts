import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { JobUnlock } from '../../master/models/jobunlock';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-jobunlocktrack',
    templateUrl: './jobunlocktrack.component.html',
    providers: [RepService]
})
export class JobUnlockTrackComponent {
    // Local Variables 
    title = 'Job Unlock Tracking Details';

    @Input() public type: string = '';
    @Input() menuid: string = '';

    menu_record: any;
    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string;
    bExcel = false;
    bCompany = false;
    bAdmin = false;
    bEmail = false;

    modal: any;
    selectedRowIndex = 0;
    pkid: string;
    searchstring: string = '';
    searchtype: string = 'ALL';
    searchformat: string = 'SUMMARY';
    listformat: string = 'SUMMARY';
    from_date: string = '';
    to_date: string = '';
    branch_code = '';
    branch_name = '';
    cust_id = '';
    cust_name = '';

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    AttachList: any[] = [];

    ErrorMessage = "";
    InfoMessage = "";
    RecordList: JobUnlock[] = [];

    constructor(
        private modalService: NgbModal,
        private mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
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
        this.LoadCombo();
    }

    InitComponent() {
        this.to_date = this.gs.defaultValues.today;
        this.from_date = this.gs.getNewdate(1);
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_print)
                this.bExcel = true;
            if (this.menu_record.rights_email)
                this.bEmail = true;
        }
        this.InitLov();
    }

    InitLov() {

    }
    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CUST") {
            this.cust_id = _Record.id;
            this.cust_name = _Record.name;
        }
        if (_Record.controlname == "BRANCH") {
            this.branch_code = _Record.code;
            this.branch_name = _Record.name;
        }
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }


    OnChange(field: string) {

    }
    // Save Data
    OnBlur(field: string) {
        // if (field == 'searchuser') {
        //     this.searchuser = this.searchuser.toUpperCase();
        // }
        // if (field == 'searchtype') {
        //     this.searchtype = this.searchtype.toUpperCase();
        // }

    }
    Close() {
        this.gs.ClosePage('home');
    }


    List(_type: string) {

        // if (_type == 'MAIL') {
        //     if (!confirm("Do you want to Sent Requested/Approved List")) {
        //         return;
        //     }
        // }

        if (_type == 'UPDATE') {
            if (!confirm("Do you want to update ?")) {
                return;
            }
        }
        this.listformat = this.searchformat;
        this.InfoMessage = "";
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
            type: _type,
            rowtype: this.type,
            report_folder: this.gs.globalVariables.report_folder,
            searchstring: this.searchstring.toUpperCase(),
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            branch_name: this.gs.globalVariables.branch_name,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            from_date: this.from_date,
            to_date: this.to_date,
            searchtype: this.searchtype,
            searchformat: this.searchformat,
            cust_id: this.cust_id,
            cust_name: this.cust_name,
            auto_mail: "N"
        };

        if (this.bCompany) {
            SearchData.branch_code = this.branch_code;
            SearchData.branch_name = this.branch_name;
        }
        else {
            SearchData.branch_code = this.gs.globalVariables.branch_code;
            SearchData.branch_name = this.gs.globalVariables.branch_name;
        }

        this.ErrorMessage = '';
        this.mainService.JobUnlocktrackRpt(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                // else if (_type == 'MAIL') {
                //     this.AttachList = new Array<any>();
                //     this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
                //     this.sSubject = response.subject;
                //     this.sMsg = '';
                //     this.sHtml = response.message;
                //     this.open(mailsent);
                // }
                else if (_type == 'UPDATE') {
                    alert("Updated Successfully");
                } else {
                    this.RecordList = response.list;
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

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

}
