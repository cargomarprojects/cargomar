import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Settings } from '../models/settings';
import { Lockingm } from '../models/settings';
import { Settings_VM } from '../models/settings';
import { ParamService } from '../services/param.service';
import { SearchTable } from '../../shared/models/searchtable';
import { PayrollSetting } from '../../hr/models/payrollsetting';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [ParamService]
})
export class SettingsComponent {
  // Local Variables 
  title = 'Settings';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = -1;

  loading = false;
  currentTab = 'COMPANY';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  modal: any;
  sub: any;
  urlid: string;

  statedisabled: boolean = false;
  transfrTableName: string = '';
  transfrLimit: number = 1;
  transfrTotRows: number = 0;
  ErrorMessage = "";

  mode = '';
  pkid = '';

  code_length: number = 10;


  no1: number = 1001;
  no2: number = 1001;

  // Array For Displaying List
  RecordList: Settings[] = [];
  // Single Record for add/edit/view details
  Record: Settings_VM = new Settings_VM;

  SaveList: Settings[] = [];

  _Record: Settings = new Settings;
  DataTransfrList: any[] = [];
  CultureList: Settings[] = [];
  LockRecord: Lockingm = new Lockingm;
  PayrollRecord: PayrollSetting = new PayrollSetting;

  // COMPANY SETTINGS

  CO_ROOT_FOLDER: string = '';
  CO_SUB_FOLDER: string = '';

  CO_BL_REG_NO: string = '';
  CO_BL_ISSUE_BY1: string = '';
  CO_BL_ISSUE_BY2: string = '';
  CO_BL_ISSUE_BY3: string = '';
  CO_BL_ISSUE_BY4: string = '';
  CO_BL_ISSUE_BY5: string = '';

  SW_ENABLED = false;

  CGSTRECORD: any;
  CGSTREC: any = { id: '', code: '', name: '' };

  SGSTRECORD: any;
  SGSTREC: any = { id: '', code: '', name: '' };

  IGSTRECORD: any;
  IGSTREC: any = { id: '', code: '', name: '' };


  RCDRCGSTRECORD: any;
  RCDRCGSTREC: any = { id: '', code: '', name: '' };

  RCDRSGSTRECORD: any;
  RCDRSGSTREC: any = { id: '', code: '', name: '' };

  RCDRIGSTRECORD: any;
  RCDRIGSTREC: any = { id: '', code: '', name: '' };


  RCCRCGSTRECORD: any;
  RCCRCGSTREC: any = { id: '', code: '', name: '' };

  RCCRSGSTRECORD: any;
  RCCRSGSTREC: any = { id: '', code: '', name: '' };

  RCCRIGSTRECORD: any;
  RCCRIGSTREC: any = { id: '', code: '', name: '' };


  UNITPCSRECORD: any;
  UNITPCSREC: any = { id: '', code: '', name: '' };

  UNITKGSRECORD: any;
  UNITKGSREC: any = { id: '', code: '', name: '' };

  UNITCTNRECORD: any;
  UNITCTNREC: any = { id: '', code: '', name: '' };

  LOCCURRECORD: any;
  LOCCURREC: any = { id: '', code: '', name: '' };

  FORCURRECORD: any;
  FORCURREC: any = { id: '', code: '', name: '' };


  DEBTORRECORD: any;
  DEBTORREC: any = { id: '', code: '', name: '' };

  CREDITORRECORD: any;
  CREDITORREC: any = { id: '', code: '', name: '' };

  DRTYPERECORD: any;
  DRTYPEREC: any = { id: '', code: '', name: '' };

  CRTYPERECORD: any;
  CRTYPEREC: any = { id: '', code: '', name: '' };


  INTLRECORD: any;
  INTLREC: any = { id: '', code: '', name: '' };

  HOACRECORD: any;
  HOACREC: any = { id: '', code: '', name: '' };


  BRACRECORD: any;
  BRACREC: any = { id: '', code: '', name: '' };


  HOBANKRECORD: any;
  HOBANKREC: any = { id: '', code: '', name: '' };


  EPFEMPLOYERRECORD: any;
  EPFEMPLOYERREC: any = { id: '', code: '', name: '' };

  LWFEMPLOYERRECORD: any;
  LWFEMPLOYERREC: any = { id: '', code: '', name: '' };


  EPFEDLIRECORD: any;
  EPFEDLIREC: any = { id: '', code: '', name: '' };

  ESIRECORD: any;
  ESIREC: any = { id: '', code: '', name: '' };

  PFPAYRECORD: any;
  PFPAYREC: any = { id: '', code: '', name: '' };

  ESIPAYRECORD: any;
  ESIPAYREC: any = { id: '', code: '', name: '' };

  LWFPAYRECORD: any;
  LWFPAYREC: any = { id: '', code: '', name: '' };





  // BRANCH SETTINGS
  BR_BL_ISSUED_PLACE: string = '';
  BR_GSTIN: string = '';
  BR_LR_PREFIX: string = '';
  BR_DOC_PREFIX: string = '';
  BR_COST_PREFIX: string = '';
  BR_COST_AIR_PREFIX: string = '';
  BR_DEFAULT_JOB_SEA: string = '';
  BR_DEFAULT_JOB_AIR: string = '';
  BR_CHQ_PRINT_HO_APRVD: boolean = false;
  BR_FLDR_SE_PREFIX: string = '';
  BR_FLDR_SI_PREFIX: string = '';
  BR_SMAN_EMAIL: string = '';
  BR_ACC_EMAIL: string = '';
  BR_CRLIMIT_ENABLED: boolean = false;
  BR_CRLIMIT_ENABLED_SI: boolean = false;


  GSTSTATERECORD: any;
  GSTSTATEREC: any = { id: '', code: '', name: '' };


  constructor(
    private modalService: NgbModal,
    private mainService: ParamService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;


    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;

        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {

      this.InitComponent();
    }
  }




  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.currentTab = 'COMPANY';
    this.initLov();
    this.List(this.currentTab);
    this.LoadCombo();
  }

  initLov(caption: string = '') {

    // COMPANY SETTINGS
    if (caption == '' || caption == 'CGST')
      this.CGSTRECORD = {
        controlname: 'CGST', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.CGSTREC.id, code: this.CGSTREC.code, name: this.CGSTREC.name
      };

    if (caption == '' || caption == 'SGST')
      this.SGSTRECORD = {
        controlname: 'SGST', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.SGSTREC.id, code: this.SGSTREC.code, name: this.SGSTREC.name
      };

    if (caption == '' || caption == 'IGST')
      this.IGSTRECORD = {
        controlname: 'IGST', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.IGSTREC.id, code: this.IGSTREC.code, name: this.IGSTREC.name
      };

    if (caption == '' || caption == 'CGST-RC-DR')
      this.RCDRCGSTRECORD = {
        controlname: 'CGST-RC-DR', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.RCDRCGSTREC.id, code: this.RCDRCGSTREC.code, name: this.RCDRCGSTREC.name
      };

    if (caption == '' || caption == 'SGST-RC-DR')
      this.RCDRSGSTRECORD = {
        controlname: 'SGST-RC-DR', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.RCDRSGSTREC.id, code: this.RCDRSGSTREC.code, name: this.RCDRSGSTREC.name
      };

    if (caption == '' || caption == 'IGST-RC-DR')
      this.RCDRIGSTRECORD = {
        controlname: 'IGST-RC-DR', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.RCDRIGSTREC.id, code: this.RCDRIGSTREC.code, name: this.RCDRIGSTREC.name
      };


    if (caption == '' || caption == 'CGST-RC-CR')
      this.RCCRCGSTRECORD = {
        controlname: 'CGST-RC-CR', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.RCCRCGSTREC.id, code: this.RCCRCGSTREC.code, name: this.RCCRCGSTREC.name
      };

    if (caption == '' || caption == 'SGST-RC-CR')
      this.RCCRSGSTRECORD = {
        controlname: 'SGST-RC-CR', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.RCCRSGSTREC.id, code: this.RCCRSGSTREC.code, name: this.RCCRSGSTREC.name
      };

    if (caption == '' || caption == 'IGST-RC-CR')
      this.RCCRIGSTRECORD = {
        controlname: 'IGST-RC-CR', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.RCCRIGSTREC.id, code: this.RCCRIGSTREC.code, name: this.RCCRIGSTREC.name
      };

    if (caption == '' || caption == 'UNIT-PCS')
      this.UNITPCSRECORD = {
        controlname: 'UNIT-PCS', type: 'UNIT', displaycolumn: 'CODE',
        parentid: '', id: this.UNITPCSREC.id, code: this.UNITPCSREC.code, name: this.UNITPCSREC.name
      };

    if (caption == '' || caption == 'UNIT-CTN')
      this.UNITCTNRECORD = {
        controlname: 'UNIT-CTN', type: 'UNIT', displaycolumn: 'CODE',
        parentid: '', id: this.UNITCTNREC.id, code: this.UNITCTNREC.code, name: this.UNITCTNREC.name
      };


    if (caption == '' || caption == 'UNIT-KGS')
      this.UNITKGSRECORD = {
        controlname: 'UNIT-KGS', type: 'UNIT', displaycolumn: 'CODE',
        parentid: '', id: this.UNITKGSREC.id, code: this.UNITKGSREC.code, name: this.UNITKGSREC.name
      };

    if (caption == '' || caption == 'LOCAL-CURRENCY')
      this.LOCCURRECORD = {
        controlname: 'LOCAL-CURRENCY', type: 'CURRENCY', displaycolumn: 'CODE',
        parentid: '', id: this.LOCCURREC.id, code: this.LOCCURREC.code, name: this.LOCCURREC.name
      };
    if (caption == '' || caption == 'FOREIGN-CURRENCY')
      this.FORCURRECORD = {
        controlname: 'FOREIGN-CURRENCY', type: 'CURRENCY', displaycolumn: 'CODE',
        parentid: '', id: this.FORCURREC.id, code: this.FORCURREC.code, name: this.FORCURREC.name
      };

    if (caption == '' || caption == 'DEBTOR')
      this.DEBTORRECORD = {
        controlname: 'DEBTOR', type: 'ACGROUPM', displaycolumn: 'CODE',
        parentid: '', id: this.DEBTORREC.id, code: this.DEBTORREC.code, name: this.DEBTORREC.name
      };

    if (caption == '' || caption == 'CREDITOR')
      this.CREDITORRECORD = {
        controlname: 'CREDITOR', type: 'ACGROUPM', displaycolumn: 'CODE',
        parentid: '', id: this.CREDITORREC.id, code: this.CREDITORREC.code, name: this.CREDITORREC.name
      };


    if (caption == '' || caption == 'DRTYPE')
      this.DRTYPERECORD = {
        controlname: 'DRTYPE', type: 'ACTYPEM', displaycolumn: 'CODE',
        parentid: '', id: this.DRTYPEREC.id, code: this.DRTYPEREC.code, name: this.DRTYPEREC.name
      };

    if (caption == '' || caption == 'CRTYPE')
      this.CRTYPERECORD = {
        controlname: 'CRTYPE', type: 'ACTYPEM', displaycolumn: 'CODE',
        parentid: '', id: this.CRTYPEREC.id, code: this.CRTYPEREC.code, name: this.CRTYPEREC.name
      };



    if (caption == '' || caption == 'INTLDEBTOR')
      this.INTLRECORD = {
        controlname: 'INTLDEBTOR', type: 'ACGROUPM', displaycolumn: 'CODE',
        parentid: '', id: this.INTLREC.id, code: this.INTLREC.code, name: this.INTLREC.name
      };


    if (caption == '' || caption == 'HOACCODE')
      this.HOACRECORD = {
        controlname: 'HOACCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.HOACREC.id, code: this.HOACREC.code, name: this.HOACREC.name
      };


    if (caption == '' || caption == 'BRACCODE')
      this.BRACRECORD = {
        controlname: 'BRACCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.BRACREC.id, code: this.BRACREC.code, name: this.BRACREC.name
      };


    if (caption == '' || caption == 'HOBANKACCODE')
      this.HOBANKRECORD = {
        controlname: 'HOBANKACCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.HOBANKREC.id, code: this.HOBANKREC.code, name: this.HOBANKREC.name
      };


    if (caption == '' || caption == 'EPFEMPLOYERCODE') {
      this.EPFEMPLOYERRECORD = {
        controlname: 'EPFEMPLOYERCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.EPFEMPLOYERREC.id, code: this.EPFEMPLOYERREC.code, name: this.EPFEMPLOYERREC.name
      };
    }

    if (caption == '' || caption == 'LWFEMPLOYERCODE') {
      this.LWFEMPLOYERRECORD = {
        controlname: 'LWFEMPLOYERCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.LWFEMPLOYERREC.id, code: this.LWFEMPLOYERREC.code, name: this.LWFEMPLOYERREC.name
      };
    }


    if (caption == '' || caption == 'EPFEDLICODE') {
      this.EPFEDLIRECORD = {
        controlname: 'EPFEDLICODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.EPFEDLIREC.id, code: this.EPFEDLIREC.code, name: this.EPFEDLIREC.name
      };
    }

    if (caption == '' || caption == 'ESICODE') {
      this.ESIRECORD = {
        controlname: 'ESICODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.ESIREC.id, code: this.ESIREC.code, name: this.ESIREC.name
      };
    }


    if (caption == '' || caption == 'PFPAYCODE') {
      this.PFPAYRECORD = {
        controlname: 'PFPAYCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.PFPAYREC.id, code: this.PFPAYREC.code, name: this.PFPAYREC.name
      };
    }

    if (caption == '' || caption == 'ESIPAYCODE') {
      this.ESIPAYRECORD = {
        controlname: 'ESIPAYCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.ESIPAYREC.id, code: this.ESIPAYREC.code, name: this.ESIPAYREC.name
      };
    }


    if (caption == '' || caption == 'LWFPAYCODE') {
      this.LWFPAYRECORD = {
        controlname: 'LWFPAYCODE', type: 'ACCTM', displaycolumn: 'CODE',
        parentid: '', id: this.LWFPAYREC.id, code: this.LWFPAYREC.code, name: this.LWFPAYREC.name
      };
    }




    // BRANCH SETTINGS

    if (caption == '' || caption == 'GST-STATE')
      this.GSTSTATERECORD = {
        controlname: 'GST-STATE', type: 'STATE', displaycolumn: 'CODE',
        parentid: '', id: this.GSTSTATEREC.id, code: this.GSTSTATEREC.code, name: this.GSTSTATEREC.name
      };

  }

  LovSelected(_Record: SearchTable) {

    // Company Settings
    if (_Record.controlname == 'CGST') {
      this.CGSTREC.id = _Record.id;
      this.CGSTREC.code = _Record.code;
      this.CGSTREC.name = _Record.name;
    }
    if (_Record.controlname == 'SGST') {
      this.SGSTREC.id = _Record.id;
      this.SGSTREC.code = _Record.code;
      this.SGSTREC.name = _Record.name;
    }
    if (_Record.controlname == 'IGST') {
      this.IGSTREC.id = _Record.id;
      this.IGSTREC.code = _Record.code;
      this.IGSTREC.name = _Record.name;
    }

    if (_Record.controlname == 'CGST-RC-DR') {
      this.RCDRCGSTREC.id = _Record.id;
      this.RCDRCGSTREC.code = _Record.code;
      this.RCDRCGSTREC.name = _Record.name;
    }
    if (_Record.controlname == 'SGST-RC-DR') {
      this.RCDRSGSTREC.id = _Record.id;
      this.RCDRSGSTREC.code = _Record.code;
      this.RCDRSGSTREC.name = _Record.name;
    }
    if (_Record.controlname == 'IGST-RC-DR') {
      this.RCDRIGSTREC.id = _Record.id;
      this.RCDRIGSTREC.code = _Record.code;
      this.RCDRIGSTREC.name = _Record.name;
    }


    if (_Record.controlname == 'CGST-RC-CR') {
      this.RCCRCGSTREC.id = _Record.id;
      this.RCCRCGSTREC.code = _Record.code;
      this.RCCRCGSTREC.name = _Record.name;
    }
    if (_Record.controlname == 'SGST-RC-CR') {
      this.RCCRSGSTREC.id = _Record.id;
      this.RCCRSGSTREC.code = _Record.code;
      this.RCCRSGSTREC.name = _Record.name;
    }
    if (_Record.controlname == 'IGST-RC-CR') {
      this.RCCRIGSTREC.id = _Record.id;
      this.RCCRIGSTREC.code = _Record.code;
      this.RCCRIGSTREC.name = _Record.name;
    }




    if (_Record.controlname == 'UNIT-PCS') {
      this.UNITPCSREC.id = _Record.id;
      this.UNITPCSREC.code = _Record.code;
      this.UNITPCSREC.name = _Record.name;
    }
    if (_Record.controlname == 'UNIT-CTN') {
      this.UNITCTNREC.id = _Record.id;
      this.UNITCTNREC.code = _Record.code;
      this.UNITCTNREC.name = _Record.name;
    }
    if (_Record.controlname == 'UNIT-KGS') {
      this.UNITKGSREC.id = _Record.id;
      this.UNITKGSREC.code = _Record.code;
      this.UNITKGSREC.name = _Record.name;
    }
    if (_Record.controlname == 'LOCAL-CURRENCY') {
      this.LOCCURREC.id = _Record.id;
      this.LOCCURREC.code = _Record.code;
      this.LOCCURREC.name = _Record.name;
    }
    if (_Record.controlname == 'FOREIGN-CURRENCY') {
      this.FORCURREC.id = _Record.id;
      this.FORCURREC.code = _Record.code;
      this.FORCURREC.name = _Record.name;
    }

    if (_Record.controlname == 'DEBTOR') {
      this.DEBTORREC.id = _Record.id;
      this.DEBTORREC.code = _Record.code;
      this.DEBTORREC.name = _Record.name;
    }

    if (_Record.controlname == 'CREDITOR') {
      this.CREDITORREC.id = _Record.id;
      this.CREDITORREC.code = _Record.code;
      this.CREDITORREC.name = _Record.name;
    }

    if (_Record.controlname == 'DRTYPE') {
      this.DRTYPEREC.id = _Record.id;
      this.DRTYPEREC.code = _Record.code;
      this.DRTYPEREC.name = _Record.name;
    }

    if (_Record.controlname == 'CRTYPE') {
      this.CRTYPEREC.id = _Record.id;
      this.CRTYPEREC.code = _Record.code;
      this.CRTYPEREC.name = _Record.name;
    }

    if (_Record.controlname == 'INTLDEBTOR') {
      this.INTLREC.id = _Record.id;
      this.INTLREC.code = _Record.code;
      this.INTLREC.name = _Record.name;
    }


    if (_Record.controlname == 'HOACCODE') {
      this.HOACREC.id = _Record.id;
      this.HOACREC.code = _Record.code;
      this.HOACREC.name = _Record.name;
    }


    // Branch Settings

    if (_Record.controlname == 'GST-STATE') {
      this.GSTSTATEREC.id = _Record.id;
      this.GSTSTATEREC.code = _Record.code;
      this.GSTSTATEREC.name = _Record.name;
    }


    if (_Record.controlname == 'BRACCODE') {
      this.BRACREC.id = _Record.id;
      this.BRACREC.code = _Record.code;
      this.BRACREC.name = _Record.name;
    }

    if (_Record.controlname == 'HOBANKACCODE') {
      this.HOBANKREC.id = _Record.id;
      this.HOBANKREC.code = _Record.code;
      this.HOBANKREC.name = _Record.name;
    }


    if (_Record.controlname == 'EPFEMPLOYERCODE') {
      this.EPFEMPLOYERREC.id = _Record.id;
      this.EPFEMPLOYERREC.code = _Record.code;
      this.EPFEMPLOYERREC.name = _Record.name;
    }

    if (_Record.controlname == 'LWFEMPLOYERCODE') {
      this.LWFEMPLOYERREC.id = _Record.id;
      this.LWFEMPLOYERREC.code = _Record.code;
      this.LWFEMPLOYERREC.name = _Record.name;
    }



    if (_Record.controlname == 'EPFEDLICODE') {
      this.EPFEDLIREC.id = _Record.id;
      this.EPFEDLIREC.code = _Record.code;
      this.EPFEDLIREC.name = _Record.name;
    }

    if (_Record.controlname == 'ESICODE') {
      this.ESIREC.id = _Record.id;
      this.ESIREC.code = _Record.code;
      this.ESIREC.name = _Record.name;
    }

    if (_Record.controlname == 'PFPAYCODE') {
      this.PFPAYREC.id = _Record.id;
      this.PFPAYREC.code = _Record.code;
      this.PFPAYREC.name = _Record.name;
    }

    if (_Record.controlname == 'ESIPAYCODE') {
      this.ESIPAYREC.id = _Record.id;
      this.ESIPAYREC.code = _Record.code;
      this.ESIPAYREC.name = _Record.name;
    }

    if (_Record.controlname == 'LWFPAYCODE') {
      this.LWFPAYREC.id = _Record.id;
      this.LWFPAYREC.code = _Record.code;
      this.LWFPAYREC.name = _Record.name;
    }



  }



  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  CompanySettings() {
    this.List('COMPANY');
  }
  BranchSettings() {
    this.List('BRANCH');
  }

  DataTransfer() {
    this.currentTab = 'DATATRANSFER';
  }

  ImportData() {
    this.currentTab = 'IMPORTDATA';
  }

  UpdateData() {
    this.currentTab = 'UPDATEDATA';
  }
  PayrollSettings() {
    this.currentTab = 'PAYROLL';
    this.PayrollList();
  }

  CultureSettings() {
    this.currentTab = 'CULTURE';
    this.CurrentCulture();
  }
  LoadCombo() {
    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.DataTransfrList = response.dtlist;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  // Query List Data
  List(_type: string) {

    this.currentTab = _type;

    this.loading = true;
    let SearchData = {
      parentid: this.gs.globalVariables.comp_code,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };
    if (_type == "COMPANY")
      SearchData.parentid = this.gs.globalVariables.comp_code;
    if (_type == "BRANCH")
      SearchData.parentid = this.gs.globalVariables.branch_code;

    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.ErrorMessage = '';
    this.mainService.getSettings(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.LockRecord = response.lockrecord;
        if (this.currentTab == 'COMPANY')
          this.ShowCompany();
        if (this.currentTab == 'BRANCH')
          this.ShowBranch();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  ShowCompany() {
    this.RecordList.forEach(rec => {



      // Company Settings

      if (rec.caption == "CGST") {
        this.CGSTREC.id = rec.id;
        this.CGSTREC.code = rec.code;
        this.CGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "SGST") {
        this.SGSTREC.id = rec.id;
        this.SGSTREC.code = rec.code;
        this.SGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "IGST") {
        this.IGSTREC.id = rec.id;
        this.IGSTREC.code = rec.code;
        this.IGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "CGST-RC-DR") {
        this.RCDRCGSTREC.id = rec.id;
        this.RCDRCGSTREC.code = rec.code;
        this.RCDRCGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "SGST-RC-DR") {
        this.RCDRSGSTREC.id = rec.id;
        this.RCDRSGSTREC.code = rec.code;
        this.RCDRSGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "IGST-RC-DR") {
        this.RCDRIGSTREC.id = rec.id;
        this.RCDRIGSTREC.code = rec.code;
        this.RCDRIGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "CGST-RC-CR") {
        this.RCCRCGSTREC.id = rec.id;
        this.RCCRCGSTREC.code = rec.code;
        this.RCCRCGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "SGST-RC-CR") {
        this.RCCRSGSTREC.id = rec.id;
        this.RCCRSGSTREC.code = rec.code;
        this.RCCRSGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "IGST-RC-CR") {
        this.RCCRIGSTREC.id = rec.id;
        this.RCCRIGSTREC.code = rec.code;
        this.RCCRIGSTREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "DEBTOR") {
        this.DEBTORREC.id = rec.id;
        this.DEBTORREC.code = rec.code;
        this.DEBTORREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "INTLDEBTOR") {
        this.INTLREC.id = rec.id;
        this.INTLREC.code = rec.code;
        this.INTLREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "CREDITOR") {
        this.CREDITORREC.id = rec.id;
        this.CREDITORREC.code = rec.code;
        this.CREDITORREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "DRTYPE") {
        this.DRTYPEREC.id = rec.id;
        this.DRTYPEREC.code = rec.code;
        this.DRTYPEREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "CRTYPE") {
        this.CRTYPEREC.id = rec.id;
        this.CRTYPEREC.code = rec.code;
        this.CRTYPEREC.name = rec.name;
        this.initLov(rec.caption);
      }



      if (rec.caption == "UNIT-PCS") {
        this.UNITPCSREC.id = rec.id;
        this.UNITPCSREC.code = rec.code;
        this.UNITPCSREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "UNIT-CTN") {
        this.UNITCTNREC.id = rec.id;
        this.UNITCTNREC.code = rec.code;
        this.UNITCTNREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "UNIT-KGS") {
        this.UNITKGSREC.id = rec.id;
        this.UNITKGSREC.code = rec.code;
        this.UNITKGSREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "LOCAL-CURRENCY") {
        this.LOCCURREC.id = rec.id;
        this.LOCCURREC.code = rec.code;
        this.LOCCURREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "FOREIGN-CURRENCY") {
        this.FORCURREC.id = rec.id;
        this.FORCURREC.code = rec.code;
        this.FORCURREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "HOACCODE") {
        this.HOACREC.id = rec.id;
        this.HOACREC.code = rec.code;
        this.HOACREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "BRACCODE") {
        this.BRACREC.id = rec.id;
        this.BRACREC.code = rec.code;
        this.BRACREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "ROOT-FOLDER")
        this.CO_ROOT_FOLDER = rec.name;
      if (rec.caption == "SUB-FOLDER")
        this.CO_SUB_FOLDER = rec.name;
      if (rec.caption == "BL-REG-NO")
        this.CO_BL_REG_NO = rec.name;
      if (rec.caption == "BL-ISSUED-BY1")
        this.CO_BL_ISSUE_BY1 = rec.name;
      if (rec.caption == "BL-ISSUED-BY2")
        this.CO_BL_ISSUE_BY2 = rec.name;
      if (rec.caption == "BL-ISSUED-BY3")
        this.CO_BL_ISSUE_BY3 = rec.name;
      if (rec.caption == "BL-ISSUED-BY4")
        this.CO_BL_ISSUE_BY4 = rec.name;
      if (rec.caption == "BL-ISSUED-BY5")
        this.CO_BL_ISSUE_BY5 = rec.name;

      if (rec.caption == "SW-ENABLED")
        this.SW_ENABLED = rec.name == "Y" ? true : false;


    })
  }

  ShowBranch() {

    // Branch Settings

    this.RecordList.forEach(rec => {

      if (rec.caption == "BL-ISSUED-PLACE")
        this.BR_BL_ISSUED_PLACE = rec.name;
      if (rec.caption == "GSTIN") {
        this.BR_GSTIN = rec.name;
      }
      if (rec.caption == "GST-STATE") {
        this.GSTSTATEREC.id = rec.id;
        this.GSTSTATEREC.code = rec.code;
        this.GSTSTATEREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "BRACCODE") {
        this.BRACREC.id = rec.id;
        this.BRACREC.code = rec.code;
        this.BRACREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "HOBANKACCODE") {
        this.HOBANKREC.id = rec.id;
        this.HOBANKREC.code = rec.code;
        this.HOBANKREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "EPFEMPLOYERCODE") {
        this.EPFEMPLOYERREC.id = rec.id;
        this.EPFEMPLOYERREC.code = rec.code;
        this.EPFEMPLOYERREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "LWFEMPLOYERCODE") {
        this.LWFEMPLOYERREC.id = rec.id;
        this.LWFEMPLOYERREC.code = rec.code;
        this.LWFEMPLOYERREC.name = rec.name;
        this.initLov(rec.caption);
      }



      if (rec.caption == "EPFEDLICODE") {
        this.EPFEDLIREC.id = rec.id;
        this.EPFEDLIREC.code = rec.code;
        this.EPFEDLIREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "ESICODE") {
        this.ESIREC.id = rec.id;
        this.ESIREC.code = rec.code;
        this.ESIREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "PFPAYCODE") {
        this.PFPAYREC.id = rec.id;
        this.PFPAYREC.code = rec.code;
        this.PFPAYREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "ESIPAYCODE") {
        this.ESIPAYREC.id = rec.id;
        this.ESIPAYREC.code = rec.code;
        this.ESIPAYREC.name = rec.name;
        this.initLov(rec.caption);
      }

      if (rec.caption == "LWFPAYCODE") {
        this.LWFPAYREC.id = rec.id;
        this.LWFPAYREC.code = rec.code;
        this.LWFPAYREC.name = rec.name;
        this.initLov(rec.caption);
      }


      if (rec.caption == "LR-PREFIX")
        this.BR_LR_PREFIX = rec.name;
      if (rec.caption == "DOC-PREFIX")
        this.BR_DOC_PREFIX = rec.name;
      if (rec.caption == "COST-PREFIX")
        this.BR_COST_PREFIX = rec.name;
      if (rec.caption == "COST-AIR-PREFIX")
        this.BR_COST_AIR_PREFIX = rec.name;
      if (rec.caption == "SEA-DEFAULT-JOB")
        this.BR_DEFAULT_JOB_SEA = rec.name;
      if (rec.caption == "AIR-DEFAULT-JOB")
        this.BR_DEFAULT_JOB_AIR = rec.name;

      if (rec.caption == "CHQ_PRINT_HO_APRVD")
        this.BR_CHQ_PRINT_HO_APRVD = rec.name == "Y" ? true : false;

      if (rec.caption == "CREDIT-LIMIT-ENABLED")
        this.BR_CRLIMIT_ENABLED = rec.name == "Y" ? true : false;
      if (rec.caption == "CREDIT-LIMIT-ENABLED_SI")
        this.BR_CRLIMIT_ENABLED_SI = rec.name == "Y" ? true : false;



      if (rec.caption == "FOLDER-SE-PREFIX")
        this.BR_FLDR_SE_PREFIX = rec.name;
      if (rec.caption == "FOLDER-SI-PREFIX")
        this.BR_FLDR_SI_PREFIX = rec.name;
      if (rec.caption == "BR-SMAN-EMAIL")
        this.BR_SMAN_EMAIL = rec.name;
      if (rec.caption == "BR-ACC-EMAIL")
        this.BR_ACC_EMAIL = rec.name;
    })
  }


  addRec(parentid: string, tablename: string, caption: string, id: string, code: string, name: string): Settings {
    var rec = new Settings;
    rec.parentid = parentid;
    rec.tablename = tablename;
    rec.caption = caption;
    rec.id = id;
    rec.code = code;
    rec.name = name;
    return rec;
  }


  // Save Company Data
  SaveCompany() {
    if (!this.allvalidCompany())
      return;
    this.loading = true;
    this.ErrorMessage = '';

    this.CreateCompanyData();

    this.Record.RecordDet = this.SaveList;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveSettings(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  SaveBranch() {
    if (!this.allvalidBranch())
      return;
    this.loading = true;
    this.ErrorMessage = '';

    this.CreateBranchData();
    this.Record.RecordDet = this.SaveList;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveSettings(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  //Company

  CreateCompanyData() {
    this.Record = new Settings_VM;
    this.SaveList = Array<Settings>();

    let _parentid = '';
    _parentid = this.gs.globalVariables.comp_code;

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'ROOT-FOLDER', '', '', this.CO_ROOT_FOLDER));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'SUB-FOLDER', '', '', this.CO_SUB_FOLDER));

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-REG-NO', '', '', this.CO_BL_REG_NO));

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-ISSUED-BY1', '', '', this.CO_BL_ISSUE_BY1));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-ISSUED-BY2', '', '', this.CO_BL_ISSUE_BY2));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-ISSUED-BY3', '', '', this.CO_BL_ISSUE_BY3));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-ISSUED-BY4', '', '', this.CO_BL_ISSUE_BY4));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-ISSUED-BY5', '', '', this.CO_BL_ISSUE_BY5));


    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'SW-ENABLED', '', '', (this.SW_ENABLED) ? "Y" : "N"));



    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'CGST', this.CGSTREC.id, this.CGSTREC.code, this.CGSTREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'SGST', this.SGSTREC.id, this.SGSTREC.code, this.SGSTREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'IGST', this.IGSTREC.id, this.IGSTREC.code, this.IGSTREC.name));


    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'CGST-RC-DR', this.RCDRCGSTREC.id, this.RCDRCGSTREC.code, this.RCDRCGSTREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'SGST-RC-DR', this.RCDRSGSTREC.id, this.RCDRSGSTREC.code, this.RCDRSGSTREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'IGST-RC-DR', this.RCDRIGSTREC.id, this.RCDRIGSTREC.code, this.RCDRIGSTREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'CGST-RC-CR', this.RCCRCGSTREC.id, this.RCCRCGSTREC.code, this.RCCRCGSTREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'SGST-RC-CR', this.RCCRSGSTREC.id, this.RCCRSGSTREC.code, this.RCCRSGSTREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'IGST-RC-CR', this.RCCRIGSTREC.id, this.RCCRIGSTREC.code, this.RCCRIGSTREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACGROUPM', 'DEBTOR', this.DEBTORREC.id, this.DEBTORREC.code, this.DEBTORREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACGROUPM', 'CREDITOR', this.CREDITORREC.id, this.CREDITORREC.code, this.CREDITORREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACGROUPM', 'INTLDEBTOR', this.INTLREC.id, this.INTLREC.code, this.INTLREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACTYPEM', 'DRTYPE', this.DRTYPEREC.id, this.DRTYPEREC.code, this.DRTYPEREC.name));
    this.SaveList.push(this.addRec(_parentid, 'ACTYPEM', 'CRTYPE', this.CRTYPEREC.id, this.CRTYPEREC.code, this.CRTYPEREC.name));


    this.SaveList.push(this.addRec(_parentid, 'PARAM', 'UNIT-PCS', this.UNITPCSREC.id, this.UNITPCSREC.code, this.UNITPCSREC.name));
    this.SaveList.push(this.addRec(_parentid, 'PARAM', 'UNIT-CTN', this.UNITCTNREC.id, this.UNITCTNREC.code, this.UNITCTNREC.name));
    this.SaveList.push(this.addRec(_parentid, 'PARAM', 'UNIT-KGS', this.UNITKGSREC.id, this.UNITKGSREC.code, this.UNITKGSREC.name));

    this.SaveList.push(this.addRec(_parentid, 'PARAM', 'LOCAL-CURRENCY', this.LOCCURREC.id, this.LOCCURREC.code, this.LOCCURREC.name));
    this.SaveList.push(this.addRec(_parentid, 'PARAM', 'FOREIGN-CURRENCY', this.FORCURREC.id, this.FORCURREC.code, this.FORCURREC.name));


    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'HOACCODE', this.HOACREC.id, this.HOACREC.code, this.HOACREC.name));



  }
  allvalidCompany() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';


    if (this.CO_BL_ISSUE_BY1.trim().length <= 0) {
      bret = false;
      sError = "BL Issued Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }



  // Branch
  CreateBranchData() {
    this.Record = new Settings_VM;
    this.SaveList = Array<Settings>();
    let _parentid = '';
    _parentid = this.gs.globalVariables.branch_code;

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BL-ISSUED-PLACE', '', '', this.BR_BL_ISSUED_PLACE.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'GSTIN', '', '', this.BR_GSTIN.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'PARAM', 'GST-STATE', this.GSTSTATEREC.id, this.GSTSTATEREC.code, this.GSTSTATEREC.name));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'LR-PREFIX', '', '', this.BR_LR_PREFIX.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'DOC-PREFIX', '', '', this.BR_DOC_PREFIX.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'COST-PREFIX', '', '', this.BR_COST_PREFIX.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'COST-AIR-PREFIX', '', '', this.BR_COST_AIR_PREFIX.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'SEA-DEFAULT-JOB', '', '', this.BR_DEFAULT_JOB_SEA.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'AIR-DEFAULT-JOB', '', '', this.BR_DEFAULT_JOB_AIR.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'BRACCODE', this.BRACREC.id, this.BRACREC.code, this.BRACREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'HOBANKACCODE', this.HOBANKREC.id, this.HOBANKREC.code, this.HOBANKREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'EPFEMPLOYERCODE', this.EPFEMPLOYERREC.id, this.EPFEMPLOYERREC.code, this.EPFEMPLOYERREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'LWFEMPLOYERCODE', this.LWFEMPLOYERREC.id, this.LWFEMPLOYERREC.code, this.LWFEMPLOYERREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'EPFEDLICODE', this.EPFEDLIREC.id, this.EPFEDLIREC.code, this.EPFEDLIREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'ESICODE', this.ESIREC.id, this.ESIREC.code, this.ESIREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'PFPAYCODE', this.PFPAYREC.id, this.PFPAYREC.code, this.PFPAYREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'ESIPAYCODE', this.ESIPAYREC.id, this.ESIPAYREC.code, this.ESIPAYREC.name));

    this.SaveList.push(this.addRec(_parentid, 'ACCTM', 'LWFPAYCODE', this.LWFPAYREC.id, this.LWFPAYREC.code, this.LWFPAYREC.name));


    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'CHQ_PRINT_HO_APRVD', '', '', this.BR_CHQ_PRINT_HO_APRVD == true ? "Y" : "N"));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'CREDIT-LIMIT-ENABLED', '', '', this.BR_CRLIMIT_ENABLED == true ? "Y" : "N"));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'CREDIT-LIMIT-ENABLED_SI', '', '', this.BR_CRLIMIT_ENABLED_SI == true ? "Y" : "N"));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'FOLDER-SE-PREFIX', '', '', this.BR_FLDR_SE_PREFIX.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'FOLDER-SI-PREFIX', '', '', this.BR_FLDR_SI_PREFIX.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BR-SMAN-EMAIL', '', '', this.BR_SMAN_EMAIL.toString().toUpperCase()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BR-ACC-EMAIL', '', '', this.BR_ACC_EMAIL.toString().toUpperCase()));
  }
  allvalidBranch() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';

    if (this.BR_BL_ISSUED_PLACE.trim().length <= 0) {
      bret = false;
      sError = "Code Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }


  // Save Data Transfer
  SaveDataTransfer() {

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;

    this.mainService.DataTransfer(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.savemsg;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  SaveImportData() {

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      paramcode: '',
      paramtype: this.transfrTableName,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_start_date: this.gs.globalVariables.year_start_date,
      year_end_date: this.gs.globalVariables.year_end_date,
      year_prefix: this.gs.globalVariables.year_prefix,
      year_code: this.gs.globalVariables.year_code,
      transferlimit: this.transfrLimit
    };

    this.DataTransfrList.forEach(rec => {
      if (rec.param_name == this.transfrTableName) {
        SearchData.paramcode = rec.param_code;
      }
    });

    SearchData.paramtype = this.transfrTableName;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.year_start_date = this.gs.globalVariables.year_start_date;
    SearchData.year_end_date = this.gs.globalVariables.year_end_date;
    SearchData.year_prefix = this.gs.globalVariables.year_prefix;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.mainService.SaveImportData(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.savemsg;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  SaveInvoices(mtype: string, subtype: string = '') {

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      type: mtype,
      subtype: subtype,
      no1: this.no1,
      no2: this.no2,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code

    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.mainService.UpdateData(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.result;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });

  }

  AutoRefresh() {

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      type: 'UPDATECC',
      subtype: 'MBL-SE',
      comp_code: this.gs.globalVariables.comp_code
    };
    this.mainService.UpdateData(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.result;
        alert(this.ErrorMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  SaveLock() {
    this.loading = true;
    this.ErrorMessage = '';
    this.LockRecord.lock_pkid = this.gs.getGuid();
    this.LockRecord._globalvariables = this.gs.globalVariables;
    this.mainService.SaveLockings(this.LockRecord)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }
  Close() {
    this.gs.ClosePage('home');
  }

  PayrollList() {
    this.loading = true;
    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.mainService.GetPayroll(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.PayrollRecord = response.record;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  SavePayroll() {
    this.loading = true;
    this.ErrorMessage = '';
    this.PayrollRecord._globalvariables = this.gs.globalVariables;
    this.mainService.SavePayroll(this.PayrollRecord)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  OnChange(field: string) {
    if (field == "transfrTableName") {
      this.GetTransferStatus();
    }
  }
  OnBlur(field: string) {

    switch (field) {
      case 'ps_admin_amt':
        {
          this.PayrollRecord.ps_admin_amt = this.gs.roundNumber(this.PayrollRecord.ps_admin_amt, 2);
          break;
        }

      case 'ps_admin_per':
        {
          this.PayrollRecord.ps_admin_per = this.gs.roundNumber(this.PayrollRecord.ps_admin_per, 4);
          break;
        }

      case 'ps_edli_per':
        {
          this.PayrollRecord.ps_edli_per = this.gs.roundNumber(this.PayrollRecord.ps_edli_per, 4);
          break;
        }

      case 'ps_edli_amt':
        {
          this.PayrollRecord.ps_edli_amt = this.gs.roundNumber(this.PayrollRecord.ps_edli_amt, 2);
          break;
        }

      case 'ps_esi_emplr_per':
        {
          this.PayrollRecord.ps_esi_emplr_per = this.gs.roundNumber(this.PayrollRecord.ps_esi_emplr_per, 4);
          break;
        }
      case 'ps_esi_limit':
        {
          this.PayrollRecord.ps_esi_limit = this.gs.roundNumber(this.PayrollRecord.ps_esi_limit, 2);
          break;
        }

      case 'ps_pf_emplr_pension_per':
        {
          this.PayrollRecord.ps_pf_emplr_pension_per = this.gs.roundNumber(this.PayrollRecord.ps_pf_emplr_pension_per, 4);
          break;
        }

      case 'ps_pf_cel_limit':
        {
          this.PayrollRecord.ps_pf_cel_limit = this.gs.roundNumber(this.PayrollRecord.ps_pf_cel_limit, 2);
          break;
        }

      case 'ps_pf_cel_limit_amt':
        {
          this.PayrollRecord.ps_pf_cel_limit_amt = this.gs.roundNumber(this.PayrollRecord.ps_pf_cel_limit_amt, 2);
          break;
        }
      case 'ps_esi_emply_per':
        {
          this.PayrollRecord.ps_esi_emply_per = this.gs.roundNumber(this.PayrollRecord.ps_esi_emply_per, 4);
          break;
        }
      case 'ps_pf_per':
        {
          this.PayrollRecord.ps_pf_per = this.gs.roundNumber(this.PayrollRecord.ps_pf_per, 4);
          break;
        }
      case 'ps_pf_col_excluded':
        {
          this.PayrollRecord.ps_pf_col_excluded = this.PayrollRecord.ps_pf_col_excluded.toUpperCase();
          break;
        }
      case 'ps_sal_calc_days':
        {
          this.PayrollRecord.ps_sal_calc_days = this.gs.roundNumber(this.PayrollRecord.ps_sal_calc_days, 0);
          break;
        }
      case 'ps_bonus_amt':
        {
          this.PayrollRecord.ps_bonus_amt = this.gs.roundNumber(this.PayrollRecord.ps_bonus_amt, 0);
          break;
        }
      case 'ps_esi_col_excluded':
        {
          this.PayrollRecord.ps_esi_col_excluded = this.PayrollRecord.ps_esi_col_excluded.toUpperCase();
          break;
        }
        case 'ps_lwf_emplr':
        {
          this.PayrollRecord.ps_lwf_emplr = this.gs.roundNumber(this.PayrollRecord.ps_lwf_emplr, 2);
          break;
        }
    }
  }

  GetTransferStatus() {
    this.ErrorMessage = "";
    this.loading = true;
    let SearchData = {
      tablename: this.transfrTableName
    };
    this.ErrorMessage = '';
    this.mainService.GetTransferStatus(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.transfrTotRows = response.totrows;
        this.transfrLimit = this.transfrTotRows;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  ShowDocuments(doc: any) {
    this.ErrorMessage = '';
    this.open(doc);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }


  SearchRecord(controlname: string) {
    this.ErrorMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: '',
      parentid: '',
      table: '26AS-UPDATE-FILE'
    };

    if (controlname == '26AS-UPDATE-FILE') {
      SearchData.pkid = '';
      SearchData.parentid = '';
      SearchData.table = '26as-update-file';
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0)
          this.ErrorMessage = response.serror;
        else {
          let strmsg: string = "";
          strmsg = "PROCESS 26AS (" + this.gs.globalVariables.year_name + ")  \n\n FILE NAME : " + response.filename + " \n\n UPLOADED ON : " + response.uploaddate;
          if (confirm(strmsg)) {
            this.Process26AS();
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Process26AS() {
    this.ErrorMessage = "";
    this.loading = true;
    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
    };
    this.ErrorMessage = '';
    this.mainService.Process(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0)
          this.ErrorMessage = response.serror;
        else
          this.ErrorMessage = "PROCESS COMPLETED " + response.smsg;
        alert(this.ErrorMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  ImportDataFromCPL(table: string, type: string) {

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      table: table,
      type: type,
    };

    // ParamService/SaveImportDataFromCpl
    this.mainService.ImportDataFromCpl(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.savemsg;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });

  }

  CurrentCulture() {
    this.loading = true;
    let SearchData = {
      parentid: this.gs.globalVariables.comp_code,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };
    this.ErrorMessage = '';
    this.mainService.CurrentCulture(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.CultureList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
