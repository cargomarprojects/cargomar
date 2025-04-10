import { Component, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { AiDocm, AiDocd } from '../models/aidocm';
import { AiDocService } from '../services/aidoc.service';

@Component({
    selector: 'app-aidoc-det',
    templateUrl: './aidoc-det.component.html'
})

export class AiDocDetComponent {
    title = 'AI Doc Report'

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() record: AiDocm;
    @Output() ModifiedRecords = new EventEmitter<any>();

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;


    loading = false;


    constructor(
        public ms: AiDocService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {


    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List();
    }



    Init() {

    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    initLov(caption: string = '') {

    }

    List() {

        this.loading = true;
        let SearchData = {
            parent_id: this.record.ai_pkid
        };
        this.ms.state.ErrorMessage = '';
        this.ms.detailList(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.record.Details = response.list;
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

    OnChange(field: string) {

    }

    Close() {
        this.gs.ClosePage('home');
    }

    updateSource(_rec: AiDocd) {
        let SearchData = {
            pkid: '',
            parent_id: ''
        }
        SearchData.parent_id = _rec.aid_parent_id;
        this.loading = true;
        this.ms.state.ErrorMessage = '';
        this.ms.updateSource(SearchData)
            .subscribe(response => {
                this.loading = false;
                // _rec.aid_map_target_value = response.target_value;
                if (response.error_msg)
                    alert(response.error_msg);
                this.List();
                if (this.ModifiedRecords != null)
                    this.ModifiedRecords.emit({ stype: 'SAVE', pkid: _rec.aid_parent_id, linked: response.doc_linked });
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

}