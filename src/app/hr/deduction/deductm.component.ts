import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Deductm } from '../models/deductm';
import { DeductmService } from '../services/deductm.service';
 

@Component({
    selector: 'app-deductm',
    templateUrl: './deductm.component.html',
    providers: [DeductmService]
})
export class DeductmComponent {
    // Local Variables 
    title = 'DEDUCTION MASTER';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    selectedRowIndex = 0;

    bChanged: boolean;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    bPrint: boolean = false;
    searchstring = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;
    lock_record: boolean = false;
    modal: any;

    ErrorMessage = "";
    InfoMessage = "";
  
    mode = '';
    pkid = '';
    // Array For Displaying List
    RecordList: Deductm[] = [];
    // Single Record for add/edit/view details
     
    constructor(
        private modalService: NgbModal,
        private mainService: DeductmService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 30;
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
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }
        this.InitLov();
        this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    InitLov() {
         
    }
 
    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string,_deductm: any) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
             
             this.pkid= this.gs.getGuid();
             this.mode = 'ADD';
             this.open(_deductm);
        }
        else if (action === 'EDIT') {
            this.pkid = id;
            this.mode = 'EDIT';
            this.open(_deductm);
        }
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
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
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
   

    RefreshList() {
        // if (this.RecordList == null)
        //     return;
        // var REC = this.RecordList.find(rec => rec.ded_pkid == this.Record.ded_pkid);
        // if (REC == null) {
        //     this.RecordList.push(this.Record);
        // }
        // else {
        //     REC.ded_emp_code = this.Record.ded_emp_code;
        //     REC.ded_emp_name = this.Record.ded_emp_name;
           
        // }
    }
 
     
    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
      }
     

     
}
