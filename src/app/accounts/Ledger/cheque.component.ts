import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Ledgert } from '../models/ledgert';
import { LedgerService } from '../services/ledger.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-cheque',
  templateUrl: './cheque.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [LedgerService]
})
export class ChequeComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';
  sub: any;
  urlid: string;
  ErrorMessage = "";
  InfoMessage = "";
  mode = '';
  pkid = '';
  isacpayee: boolean = false;
  cheque_format_id: string = "";
  ChequeFormatList: any[] = [];

  // Array For Displaying List
  RecordList: Ledgert[] = [];
  // Single Record for add/edit/view details
  Record: Ledgert = new Ledgert;

  constructor(
    private modalService: NgbModal,
    private mainService: LedgerService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
     
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.InitLov();
    this.LoadCombo();
    
  }


  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  
  }

  LoadCombo() {

    this.loading = true;
    let SearchData = {
      type: 'CHQ',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      blf_type: "CHQUE"
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ChequeFormatList = response.blprintformatlist;

        if (this.ChequeFormatList != null) {
          if (this.ChequeFormatList.length > 0)
            this.cheque_format_id = this.ChequeFormatList[0].blf_pkid;
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }


  InitLov(saction: string = '') {

    
  }

  LovSelected(_Record: SearchTable) {
     
  }
   

  ResetControls() {
    this.disableSave = true;
    return this.disableSave;
  }
 

  Close() {
    //this.gs.ClosePage('home');
  }


  open(content: any) {
    
  }


  onLostFocus(field: string) {
    //if (field == 'jvh_cc_code') {
    //  this.SearchRecord('jvh_cc_code');
    //}
  }


  folder_id: string;
  PrintCheque(_type: string = 'PDF') {
    this.ErrorMessage = ''

    if (this.parentid.length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
    }
    if (this.cheque_format_id.length <= 0) {
      this.ErrorMessage += "\n\r | Cheque format Cannot be blank";
    }
    
    if (this.ErrorMessage.length > 0)
      return;


    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: '',
      ac_payee:'N',
      format_id:''
    }

    SearchData.pkid = this.parentid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.ac_payee = this.isacpayee == true ? "Y" : "N";
    SearchData.format_id = this.cheque_format_id;

    this.ErrorMessage = '';
    this.mainService.PrintCheque(SearchData)
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
}


