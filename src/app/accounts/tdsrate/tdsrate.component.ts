import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Tdsrate, Tdsratedet } from '../models/tdsrate';
import { TdsRateService } from '../services/tdsrate.service';
import { SearchTable } from '../../shared/models/searchtable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-tdsrate',
    templateUrl: './tdsrate.component.html',
    providers: [TdsRateService]
})

export class TdsRateComponent {
    // Local Variables 
    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    modal: any;
    disableSave = true;
    loading = false;

    // Single Record for add/edit/view details
    Record: Tdsrate = new Tdsrate;

    constructor(
        private modalService: NgbModal,
        private mainService: TdsRateService,
        private gs: GlobalService
    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }

    showmodal(remmodal: any = null) {

        let SearchData = {
            company_code: this.gs.globalVariables.comp_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code
        }

        this.mainService.List(SearchData).subscribe(response => {
            this.Record.rateList = response.list;
            this.open(remmodal);

        }, error => {
            alert(this.gs.getError(error));
        });

    }
    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    Save() {

        if (this.gs.isBlank(this.Record.rateList)) {
            alert('Invalid List');
            return;
        }

        if (!this.allvalid())
            return;
        this.loading = true;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                alert('Save Complete')

            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));

                });

    }

    allvalid() {

        let sError: string = "";
        let bret: boolean = true;
        if (this.Record.rateList.length <= 0) {
            bret = false;
            sError += "\n\r| No Details to Save";
        }

        if (bret === false) {
            alert(sError);
        }
        return bret;
    }

    OnBlur(feild: string, _rec: Tdsratedet) {

        if (feild == "tr_huf_rate")
            _rec.tr_huf_rate = this.gs.roundNumber(_rec.tr_huf_rate, 2);

        if (feild == "tr_other_rate")
            _rec.tr_other_rate = this.gs.roundNumber(_rec.tr_other_rate, 2);

        if (feild == "tr_pan_inoper_rate")
            _rec.tr_pan_inoper_rate = this.gs.roundNumber(_rec.tr_pan_inoper_rate, 2);

        if (feild == "tr_tech_service_rate")
            _rec.tr_tech_service_rate = this.gs.roundNumber(_rec.tr_tech_service_rate, 2);

    }
    CloseModal(_type: string) {
        if (_type == "OK") {
            this.Save();
        } else
            this.modal.close();
    }

}


