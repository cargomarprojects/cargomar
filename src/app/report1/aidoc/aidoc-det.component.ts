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
    @Input() bsave: boolean = false;
    @Input() bdelete: boolean = false;
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
                if (!this.gs.isBlank(this.record.Details)) {
                    for (let rec2 of this.record.Details) {
                        rec2.aid_doc_type_update = rec2.aid_doc_type;
                    }
                }

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

    updateDocType(_id: string, _type: string) {
        let SearchData2 = {
            pkid: _id,
            type: _type
        };
        this.loading = true;
        this.ms.state.ErrorMessage = '';
        this.ms.updateDocType(SearchData2)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {
                    for (let rec2 of this.record.Details.filter(rec2 => rec2.aid_pkid == _id)) {
                        rec2.aid_doc_type = response.doctype;
                    }
                }
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

     deleteRecord(_rec: AiDocd) {
        if (!confirm("Do you want to Delete")) {
          return;
        }
        this.loading = true;
        let SearchData = {
          pkid: _rec.aid_pkid,
          deleted:'N'
        };
        this.ms.state.ErrorMessage = '';
        this.ms.deleteRecord(SearchData)
          .subscribe(response => {
            this.loading = false;
            this.record.Details.splice(this.record.Details.findIndex(rec => rec.aid_pkid == _rec.aid_pkid), 1);
            // alert("Deleted Successfully");
          },
            error => {
              this.loading = false;
              this.ms.state.ErrorMessage = this.gs.getError(error);
              alert(this.ms.state.ErrorMessage);
            });
      }

}