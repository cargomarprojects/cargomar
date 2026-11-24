import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../../../core/services/global.service';
import { EdiJob } from '../../../models/edijob';
import { EdijobEditService } from '../../../services/edijobedit.service';
import { SearchTable } from '../../../../shared/models/searchtable';


@Component({
    selector: 'app-edijob-edit',
    templateUrl: './edijob-edit.component.html',
    providers: [EdijobEditService]
})
export class EdijobEditComponent {
    // Local Variables 
    title = 'EDI Job List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() pkid: string = '';
    @Input() parentid: string = '';
    @Output() ModifiedRecords = new EventEmitter<any>();

    selectedRowIndex: number = -1;

    modal: any;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';

    // Array For Displaying List
    RecordList: EdiJob[] = [];
    // Single Record for add/edit/view details
    Record: EdiJob = new EdiJob;

    constructor(
        private mainService: EdijobEditService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private modalService: NgbModal,
    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (this.pkid)
            this.GetRecord();
        else
            alert('Invalid ID');
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }
 
    // Load a single Record for VIEW/EDIT
    GetRecord() {
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    LoadData(_Record: EdiJob) {
        this.Record = _Record;
        this.Record.rec_mode = 'EDIT';
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                if (this.ModifiedRecords != null)
                this.ModifiedRecords.emit({ saction: 'SAVE', sid: this.pkid, _rec: this.Record });
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.Record.pkid.trim().length <= 0) {
            bret = false;
            sError += "\n\r | ID Cannot Be Blank";
        }

        /*
          if (this.Record.ord_desc.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Description Cannot Be Blank";
          }
        */


        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }
 
    Close() {
        this.gs.ClosePage('home');
    }

    OnFocus(field: string) {
        this.bChanged = false;
    }

    OnChange(field: string) {
        this.bChanged = true;
    }

    OnBlur(field: string) {
        switch (field) {

            case 'job_ref_no':
                {
                    this.Record.job_ref_no = this.Record.job_ref_no.toUpperCase();
                    break;
                }
                case 'job_type':
                {
                    this.Record.job_type = this.Record.job_type.toUpperCase();
                    break;
                }
                case 'transport_mode':
                {
                    this.Record.transport_mode = this.Record.transport_mode.toUpperCase();
                    break;
                }
                case 'shipper_name':
                {
                    this.Record.shipper_name = this.Record.shipper_name.toUpperCase();
                    break;
                }
                case 'shipper_address':
                {
                    this.Record.shipper_address = this.Record.shipper_address.toUpperCase();
                    break;
                }
                case 'consignee_name':
                {
                    this.Record.consignee_name = this.Record.consignee_name.toUpperCase();
                    break;
                }
                case 'consignee_address':
                {
                    this.Record.consignee_address = this.Record.consignee_address.toUpperCase();
                    break;
                }
                case 'consignee_zip_code':
                {
                    this.Record.consignee_zip_code = this.Record.consignee_zip_code.toUpperCase();
                    break;
                }
                case 'buyer_name':
                {
                    this.Record.buyer_name = this.Record.buyer_name.toUpperCase();
                    break;
                }
                case 'buyer_address':
                {
                    this.Record.buyer_address = this.Record.buyer_address.toUpperCase();
                    break;
                }
                case 'buyer_zip_code':
                {
                    this.Record.buyer_zip_code = this.Record.buyer_zip_code.toUpperCase();
                    break;
                }
                case 'to_order_name':
                {
                    this.Record.to_order_name = this.Record.to_order_name.toUpperCase();
                    break;
                }
                case 'to_order_address':
                {
                    this.Record.to_order_address = this.Record.to_order_address.toUpperCase();
                    break;
                }
                case 'ad_code':
                {
                    this.Record.ad_code = this.Record.ad_code.toUpperCase();
                    break;
                }
                case 'nfei':
                {
                    this.Record.nfei = this.Record.nfei.toUpperCase();
                    break;
                }
                case 'place_of_receipt':
                {
                    this.Record.place_of_receipt = this.Record.place_of_receipt.toUpperCase();
                    break;
                }
                case 'pre_carriage':
                {
                    this.Record.pre_carriage = this.Record.pre_carriage.toUpperCase();
                    break;
                }
                case 'origin_country':
                {
                    this.Record.origin_country = this.Record.origin_country.toUpperCase();
                    break;
                }
                case 'origin_state':
                {
                    this.Record.origin_state = this.Record.origin_state.toUpperCase();
                    break;
                }
                case 'load_port':
                {
                    this.Record.load_port = this.Record.load_port.toUpperCase();
                    break;
                }
                case 'discharge_port':
                {
                    this.Record.discharge_port = this.Record.discharge_port.toUpperCase();
                    break;
                }
                case 'discharge_country':
                {
                    this.Record.discharge_country = this.Record.discharge_country.toUpperCase();
                    break;
                }
                case 'destination_port':
                {
                    this.Record.destination_port = this.Record.destination_port.toUpperCase();
                    break;
                }
                case 'destination_country':
                {
                    this.Record.destination_country = this.Record.destination_country.toUpperCase();
                    break;
                }
                case 'commodity':
                {
                    this.Record.commodity = this.Record.commodity.toUpperCase();
                    break;
                }

                case 'cargo_movement':
                {
                    this.Record.cargo_movement = this.Record.cargo_movement.toUpperCase();
                    break;
                }

                case 'freight_terms':
                {
                    this.Record.freight_terms = this.Record.freight_terms.toUpperCase();
                    break;
                }

                case 'cargo_nature':
                {
                    this.Record.cargo_nature = this.Record.cargo_nature.toUpperCase();
                    break;
                }

                case 'stuffed_at':
                {
                    this.Record.stuffed_at = this.Record.stuffed_at.toUpperCase();
                    break;
                }

                case 'pkgs_unit':
                {
                    this.Record.pkgs_unit = this.Record.pkgs_unit.toUpperCase();
                    break;
                }

                case 'wt_unit':
                {
                    this.Record.wt_unit = this.Record.wt_unit.toUpperCase();
                    break;
                }

                case 'ord_exp_name':
                {
                    this.Record.sb_remarks = this.Record.sb_remarks.toUpperCase();
                    break;
                }

                case 'shipping_bill_no':
                {
                    this.Record.shipping_bill_no = this.Record.shipping_bill_no.toUpperCase();
                    break;
                }


        }
    }
    
}
