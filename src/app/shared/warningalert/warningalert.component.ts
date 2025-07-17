import { Component, Input, Output, OnInit, OnDestroy, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-warningalert',
    templateUrl: './warningalert.component.html'
})
export class WarningAlertComponent {
    // Local Variables 
    title = 'Warning Message';
    @Input() WarningMessage: string = '';
    @Input() showYesNo: boolean = false;
    @ViewChild('warningmodal') warningModal: any;

    modal: any;

    constructor(
        private modalService: NgbModal,
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

    open(content: any) {
        this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: true, windowClass: 'modal-custom' });
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

    public show() {
        this.open(this.warningModal);
    }


    public showConfirm(_msg: string): Promise<boolean> {
        this.WarningMessage = _msg;
        this.modal = this.modalService.open(this.warningModal, {
            size: "sm",
            backdrop: 'static',
            keyboard: true,
            windowClass: 'modal-custom'
        });

        return this.modal.result.then(
            (result) => result === 'confirm',
            (reason) => false // dismissed
        );
    }

}