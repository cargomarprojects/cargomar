import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { AiDocm } from '../models/aidocm';
import { AiDocService } from '../services/aidoc.service';

@Component({
    selector: 'app-aidoc',
    templateUrl: './aidoc.component.html',
    providers: [AiDocService]
})

export class AiDocComponent {
    // Local Variables 
    title = 'Ai Document';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    loading = false;
    menu_record: any;
    sub: any;
    urlid: string;

    constructor(
        private modalService: NgbModal,
        public ms: AiDocService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitCompleted = true;
            this.InitComponent();
        }

        this.ms.init(this.menuid);

        // if (this.ms.state.mode == "ADD")
        //     this.ActionHandler('ADD', '');
        // else if (this.ms.state.mode == "EDIT")
        //     this.ActionHandler('EDIT', this.ms.state.pkid)

    }

    InitComponent() {
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            searchstring: this.ms.state.searchstring.toUpperCase(),
            page_count: this.ms.state.page_count,
            page_current: this.ms.state.page_current,
            page_rows: this.ms.state.page_rows,
            page_rowcount: this.ms.state.page_rowcount
        };
        this.ms.state.ErrorMessage = '';
        this.ms.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ms.state.RecordList = response.list;
                this.ms.state.page_count = response.page_count;
                this.ms.state.page_current = response.page_current;
                this.ms.state.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

    Close() {
        this.gs.ClosePage('home');
    }

    OnBlur(controlname: string) {

        if (controlname == 'searchstring') {
            this.ms.state.searchstring = this.ms.state.searchstring.toUpperCase();
        }
    }
}