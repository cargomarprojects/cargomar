import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MailList } from '../../master/models/maillist';
import { MailDirectService } from '../services/maildirect.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//CREATED-AJITH-21-09-2021

@Component({
    selector: 'app-mail-direct',
    templateUrl: './mail-direct.component.html'
})
export class MailDirectComponent {
    // Local Variables 
    title = 'Mail Details';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() branch_code: string = '';

    modal: any;

    ErrorMessage = "";
    InfoMessage = "";

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
            branch_code: this.branch_code
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

    OnChange(field: string) {

    }

    Close() {
      this.modal.close();
    }

    SentMail()
    {
        if (!confirm("Do you want to Sent Mail")) {
            return;
          }
    }
}
