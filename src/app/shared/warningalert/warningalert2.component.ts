import { Component, Input, Output, OnInit, OnDestroy, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { WarningMsg } from '../../shared/models/warningmsg';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-warningalert2',
    templateUrl: './warningalert2.component.html'
})
export class WarningAlert2Component {
    // Local Variables 
    title = 'Warning Message';
    @ViewChild('warningmodal2') warningModal: any;
    RecordList: WarningMsg[] = [];
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

    public showList(_warningRecords: WarningMsg[]) {
        this.RecordList = _warningRecords;
        if (!this.gs.isBlank(this.RecordList)) {
            if (this.RecordList.length > 0)
                this.open(this.warningModal);
        }
    }

}