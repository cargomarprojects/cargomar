import { Component, Input, Output, OnInit, OnDestroy, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MailList } from '../../master/models/maillist';
import { MailDirectService } from '../services/maildirect.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//CREATED-AJITH-21-10-2021
//EDIT-AJITH-22-10-2021

@Component({
    selector: 'app-mail-direct',
    templateUrl: './mail-direct.component.html'
})
export class MailDirectComponent {
    // Local Variables 
    title = 'Mail Details';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Output() mailcallbackevent = new EventEmitter<any>();

    modal: any;

    ErrorMessage = "";
    InfoMessage = "";
    selectall: boolean = true;
    // Array For Displaying List
    RecordList: MailList[] = [];
    // Single Record for add/edit/view details
    Record: MailList = new MailList;

    constructor(
        private modalService: NgbModal,
        private mainService: MailDirectService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }


    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    GetMailList(mailmodal: any = null) {
        if (this.type == undefined || this.type == '') {
            alert('Invalid Type');
            return;
        }

        let SearchData = {
            mailtype: this.type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.RecordList = response.list;
                this.open(mailmodal);
            },
                error => {
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }

    OnBlur(field: string) {

        // if (field == 'ml_cust_name') {
        //     this.Record.ml_cust_name = this.Record.ml_cust_name.toUpperCase();
        // }


    }
    SelectDeselect() {
        this.selectall = !this.selectall;
        for (let rec of this.RecordList) {
            rec.rec_checked = this.selectall;
        }
    }
    IsChecked(_rec: MailList) {
        _rec.rec_checked = !_rec.rec_checked;
    }
    OnChange(field: string) {

    }

    Close() {
        this.modal.close();
    }

    SendMail() {

        let sbr_code: string = "";
        for (let rec of this.RecordList.filter(rec => rec.rec_checked == true)) {
            if (sbr_code != "")
                sbr_code += ",";
            sbr_code += rec.rec_branch_code;
        }

        if (sbr_code == "") {
            alert("No Rows Selected")
            return;
        }

        if (this.mailcallbackevent)
            this.mailcallbackevent.emit({ action: 'MAIL', brcodes: sbr_code });
        this.Close();
    }
}
