import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { documentm } from '../models/documentm';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-reportdocs',
    templateUrl: './reportdocs.component.html',
})
export class ReportDocsComponent {
    // Local Variables 
    title = 'Files List';

    @Input() public pkid: string;
    @Input() public type: string = '';
    @Input() menuid: string = '';

    menu_record: any;
    InitCompleted: boolean = false;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    modal: any;

    ErrorMessage = "";
    InfoMessage = "";
    RecordList: documentm[] = [];

    constructor(
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

        // URL Query Parameter 

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }
    }

    InitComponent() {


    }


    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }



    // Save Data
    OnBlur(field: string) {

    }
    

    HistoryList(historymodal: any = null) {

        this.InfoMessage = '';
        this.ErrorMessage = '';
        this.loading = true;
        let SearchData = {
            table: 'reportdocslist',
            parentid: this.pkid,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder
        };

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = '';
                this.RecordList = response.list;
                 this.open(historymodal);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
      }

      Close() {
        this.modal.close();
    }

    Download(_rec:documentm)
    {
        this.Downloadfile(_rec.doc_file_path, "SB", _rec.doc_file_name);
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
      }
}
