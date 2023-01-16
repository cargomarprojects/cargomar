import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Qtnm, QtndLcl } from '../models/qtnm';
import { AutoCompleteComponent } from '../../shared/autocomplete/autocomplete.component';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-qtnlcldet',
    templateUrl: './qtnlcldet.component.html'
})
export class QtnLclDetComponent {
    // Local Variables 
    title = 'Quotation';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() Record: Qtnm = new Qtnm;

    @ViewChild('AcLov') private AcLovCmp: AutoCompleteComponent;

    selectedRowIndex: number = -1;


    bChanged: boolean;

    total_amt: number = 0;

    loading = false;
    currentTab = 'LIST';

    search_inv_pkid: string = '';

    category: string = '';

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;
    Recorddet: QtndLcl = new QtndLcl;

    ACCRECORD: SearchTable = new SearchTable();
    CURRECORD: SearchTable = new SearchTable();
    CNTRTYPERECORD: SearchTable = new SearchTable();
    REBTCURRECORD: SearchTable = new SearchTable();
    constructor(
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

        this.InitLov();

        this.category = '';

        if (this.type == 'SE-CLR')
            this.category = 'SEA EXPORT CLERING';
        else if (this.type == 'AE-CLR')
            this.category = 'AIR EXPORT CLEARING';
        else if (this.type == 'AI-CLR')
            this.category = 'AIR IMPORT CLEARING';
        else if (this.type == 'SI-CLR')
            this.category = 'SEA IMPORT CLEARING';
        else {
            this.type = 'SE-CLR';
            this.category = 'AIR EXPORT CLEARING';
        }

        this.ChangeAccList();
        this.FindListTotal();
        this.NewRecord();
        // this.List('NEW');
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
    }

    InitLov() {

        this.ACCRECORD = new SearchTable();
        this.ACCRECORD.controlname = "ACCTM";
        this.ACCRECORD.displaycolumn = "CODE";
        this.ACCRECORD.type = "ACCTM";
        this.ACCRECORD.id = "";
        this.ACCRECORD.code = "";
        this.ACCRECORD.name = "";

        this.CURRECORD = new SearchTable();
        this.CURRECORD.controlname = "CURRENCY";
        this.CURRECORD.displaycolumn = "CODE";
        this.CURRECORD.type = "CURRENCY";
        this.CURRECORD.id = "";
        this.CURRECORD.code = "";
        this.CURRECORD.name = "";

        this.CNTRTYPERECORD = new SearchTable();
        this.CNTRTYPERECORD.controlname = "CNTRTYPE";
        this.CNTRTYPERECORD.displaycolumn = "CODE";
        this.CNTRTYPERECORD.type = "CONTAINER TYPE";
        this.CNTRTYPERECORD.id = "";
        this.CNTRTYPERECORD.code = "";
        this.CNTRTYPERECORD.name = "";
        this.CNTRTYPERECORD.where = "";


        this.ChangeAccList();

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.Recorddet.qtnd_acc_id = _Record.id;
            this.Recorddet.qtnd_acc_code = _Record.code;
            this.Recorddet.qtnd_acc_name = _Record.name;
        }
        if (_Record.controlname == "CURRENCY") {
            this.Recorddet.qtnd_curr_id = _Record.id;
            this.Recorddet.qtnd_curr_code = _Record.code;
            this.Recorddet.qtnd_exrate = _Record.rate;
            this.bChanged = true;
            this.OnBlur('inv_exrate');
        }
        if (_Record.controlname == "CNTRTYPE") {
            this.Recorddet.qtnd_cntr_type_id = _Record.id;
            this.Recorddet.qtnd_cntr_type_code = _Record.code;
        }

    }

    RemoveList(event: any) {
        if (event.selected) {
            this.Record.qtnm_detList.splice(this.Record.qtnm_detList.findIndex(rec => rec.qtnd_pkid == event.id), 1);
        }
    }

    ResetControls() {

    }

    FindListTotal() {
        this.total_amt = 0;
        this.Record.qtnm_detList.forEach(rec => {
            this.total_amt += rec.qtnd_total;
        });
    }




    NewRecord() {

        this.Recorddet = new QtndLcl();

        this.Recorddet.qtnd_pkid = this.gs.getGuid();

        this.Recorddet.qtnd_parent_id = this.pkid;

        this.Recorddet.qtnd_acc_id = '';
        this.Recorddet.qtnd_acc_code = '';
        this.Recorddet.qtnd_acc_name = '';

        this.Recorddet.qtnd_type = 'INVOICE';

        this.Recorddet.qtnd_cntr_type_id = '';
        this.Recorddet.qtnd_cntr_type_code = '';

        this.Recorddet.qtnd_curr_id = '';
        this.Recorddet.qtnd_curr_code = '';

        this.Recorddet.qtnd_qty = 0;
        this.Recorddet.qtnd_rate = 0;

        this.Recorddet.qtnd_exrate = 1;

        this.Recorddet.qtnd_remarks = '';

        this.Recorddet.rec_mode = "ADD";

        this.InitLov();

        //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    }

    AddRecord() {

        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        // if (this.Record.qtn_party_id.length <= 0) {
        //   bret = false;
        //   sError += "|A/c Code Cannot Be Blank";
        // }


        if (this.Recorddet.qtnd_acc_id == '') {
            bret = false;
            sError += " | Invalid A/c Code";
        }


        if (this.Recorddet.qtnd_curr_id == '') {
            bret = false;
            sError += " | Invalid Currency";
        }


        if (this.Recorddet.qtnd_qty <= 0) {
            bret = false;
            sError += " | Invalid Qty";
        }

        if (this.Recorddet.qtnd_rate <= 0) {
            bret = false;
            sError += " | Invalid Rate";
        }

        if (this.Recorddet.qtnd_exrate <= 0) {
            bret = false;
            sError += " | Invalid Ex.Rate";
        }

        if (this.Recorddet.qtnd_total <= 0) {
            bret = false;
            sError += " | Invalid Total Amount";
        }

        if (bret === false) {
            alert(sError);
            return;
        }


        this.Record.qtnm_detList.push(this.Recorddet);
        this.FindListTotal()
        this.NewRecord();
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

    ChangeAccList() {
        let sWhere: string = '';
        if (this.type == 'SE-CLR') {
            sWhere = "acc_main_code in ('1101','1102','1103','1104')";
        }
        if (this.type == 'AE-CLR') {
            sWhere = "acc_main_code in ('1201','1202','1203','1204')";
        }
        if (this.type == 'SI-CLR') {
            sWhere = "acc_main_code in ('1301','1302','1303','1304')";
        }
        if (this.type == 'AI-CLR') {
            sWhere = "acc_main_code in ('1401','1402','1403','1404')";
        }

        this.ACCRECORD.where = sWhere;
    }

    // SEA EXP FRT MEMO  " (acc_main_code in ('1104','1105','1108', '4501') or acc_code ='1106002') ";
    // SEA EXP JOB sWhere = " (acc_main_code in ('1101','1102','1103','1107','4501') or acc_code ='1106001') ";


    OnBlur(field: string) {
        let amt: number;
        switch (field) {
            case 'qtn_acc_name': {
                break;
            }
            case 'qtn_remarks': {
                break;
            }
            case 'qtnd_qty': {
                this.Findtotal();
                break;
            }
            case 'qtnd_rate': {
                this.Findtotal();
                break;
            }
            case 'qtnd_exrate': {
                this.Findtotal();
                break;
            }
        }
    }


    Findtotal() {
        let amt: number;
        amt = this.Recorddet.qtnd_qty * (this.Recorddet.qtnd_rate * this.Recorddet.qtnd_exrate);
        this.Recorddet.qtnd_total = amt;
    }



    /*
      folder_id: string;
      PrintFrightMemo(Id: string, _type: string) {
        this.folder_id = this.gs.getGuid();
        this.loading = true;
        let SearchData = {
          type: _type,
          pkid: Id,
          report_folder: '',
          folderid: '',
          branch_code: '',
          report_caption: '',
          parentid: '',
          comp_code: '',
          incometype: ''
        };
        SearchData.type = _type;
        SearchData.pkid = this.pkid;
        SearchData.parentid = '';
        SearchData.report_folder = this.gs.globalVariables.report_folder;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        SearchData.folderid = this.folder_id;
        SearchData.comp_code = this.gs.globalVariables.comp_code;
    
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.PrintFrightMemo(SearchData)
          .subscribe(response => {
            this.loading = false;
            this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          },
          error => {
            this.loading = false;
            this.ErrorMessage = this.gs.getError(error);
          });
      }
    
      Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
      }
    */
}
