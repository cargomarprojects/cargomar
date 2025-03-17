import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { AiDocm, AiDocd } from '../models/aidocm';
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
            searchtype: this.ms.state.searchtype.toUpperCase(),
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

        if (controlname == 'searchtype') {
            this.ms.state.searchtype = this.ms.state.searchtype.toUpperCase();
        }
        if (controlname == 'searchstring') {
            this.ms.state.searchstring = this.ms.state.searchstring.toUpperCase();
        }

    }


    Save() {

        let Rec: AiDocm = new AiDocm();

        Rec.ai_pkid = this.gs.getGuid();
        Rec.ai_date = this.gs.defaultValues.today;
        Rec.ai_secret = "2025";
        Rec.ai_from_id = "chennaiops12356@cargomar.in";
        Rec.ai_to_id = "softwaresupport122673@cargomar.in";
        Rec.ai_subject = "SB-CHNSF SB#8841230 DT.02/Apr/2025";
        Rec.ai_type = "SBNEW";
        Rec.ai_folder = "c:/Reports//INWARD-EDI-FILES/CHNSF/SB-SHIPPER-INVOICE/2024-04-02";
        Rec.ai_subfolder = "Sb-Shipper-INVOICE";
        Rec.ai_bucket = "b25003";
        Rec.ai_status = "FILES-DOWNLOADED";
        Rec.ai_hitl = "N";
        Rec.Details = this.getList(Rec);
        Rec.rec_mode = "ADD";

        //console.log(JSON.stringify(Rec));

        // this.getDetList('FILES-DOWNLOADED');

        this.loading = true;
        this.ms.Save(Rec)
            .subscribe(response => {
                this.loading = false;
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });


    }

    getList(_rec: AiDocm) {
        let dList = new Array<AiDocd>();
        let dRec = new AiDocd();
        dRec.aid_pkid = this.gs.getGuid();
        dRec.aid_parent_id = _rec.ai_pkid;
        dRec.aid_folder = '20250317a';
        dRec.aid_file_name = 'Abc.pdf';
        dRec.aid_doc_type = 'SB'
        dRec.aid_classified = 'N';
        dRec.aid_extracted = 'N';
        dList.push(dRec);

        dRec = new AiDocd();
        dRec.aid_pkid = this.gs.getGuid();
        dRec.aid_parent_id = _rec.ai_pkid;
        dRec.aid_folder = '20250317a';
        dRec.aid_file_name = 'Abc2.pdf';
        dRec.aid_doc_type = 'PL';
        dRec.aid_classified = 'N';
        dRec.aid_extracted = 'N';
        dList.push(dRec);

        dRec = new AiDocd();
        dRec.aid_pkid = this.gs.getGuid();
        dRec.aid_parent_id = _rec.ai_pkid;
        dRec.aid_folder = '20250317a';
        dRec.aid_file_name = 'Abc3.pdf';
        dRec.aid_classified = 'N';
        dRec.aid_extracted = 'N';
        dList.push(dRec);
        return dList;
    }

    getDetList(_type: string) {

        this.loading = true;
        let SearchData = {
            status: _type
        };
        this.ms.state.ErrorMessage = '';
        this.ms.getList(SearchData)
            .subscribe(response => {
                this.loading = false;
                // console.log(JSON.stringify(response.list));
                console.log(response.list);
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

}