import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Mark_Qtnm, Mark_Qtnd, SaveTermsData } from '../../models/quotation';
import { GenRemarks } from '../../../shared/models/genremarks';
import { SearchTable } from '../../../shared/models/searchtable';
import { QuotationTabularService } from '../../services/quotationtabular.service';

// TABULAR-QTN: a config-panel chip = one selected master value (carrier / container /
// currency / charge) for this quotation.
interface TabChip {
  id: string;
  code: string;
  name: string;
  rowid?: string;   // stable per-row key for the Description grid rows (charges)
}

// TABULAR-QTN: component for the TABULAR quotation type. Cloned from
// QuotationFclComponent; the FCL line-item editor is replaced by a
// carrier > container > currency x charge grid that pivots MARK_QTND rows.
@Component({
  selector: 'app-quotation-tabular',
  templateUrl: './quotation-tabular.component.html',
  // TABULAR-QTN: component-scoped CSS lives in the .css file (scoped to this component).
  styleUrls: ['./quotation-tabular.component.css'],
  providers: [QuotationTabularService]
})
export class QuotationTabularComponent {

  title = 'Tabular Quotation';
  @Input() menuid: string = '';
  @Input() type: string = 'TABULAR';   // REC_CATEGORY / discriminator (PRD §12)

  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  mode = '';                 // 'ADD' | 'EDIT' | 'VIEW'
  pkid = '';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  ErrorMessage = '';
  InfoMessage = '';

  carrier_lov = 'SEA CARRIER';
  acc_sWhere = " actype_name in ('DIRECT EXPENSE','INDIRECT EXPENSE','DIRECT INCOME','INDIRECT INCOME') ";

  IsAdmin: boolean = false;
  IsCompany: boolean = false;
  bPrint: boolean = false;

  RecordList: Mark_Qtnm[] = [];
  Record: Mark_Qtnm = new Mark_Qtnm;

  // Notes (per quotation) + Terms & Conditions (template per quotation type)
  TermList: Mark_Qtnm[] = [];
  FullTermList: Mark_Qtnm[] = [];

  // Quote.To LOVs (customer -> address/branch -> contact), like QuotationComponent
  CUSTRECORD: SearchTable = new SearchTable();
  CUSTADDRECORD: SearchTable = new SearchTable();
  CONTRECORD: SearchTable = new SearchTable();

  // TABULAR-QTN: the grid axes (chips) + the cell store.
  Carriers: TabChip[] = [];
  Containers: TabChip[] = [];
  Currencies: TabChip[] = [];
  Refs: TabChip[] = [];
  selectedCarrierId = '';                     // the one carrier editable at a time
  currExrate: { [currId: string]: number } = {};   // per-quotation exchange rate by currency
  cells: { [key: string]: { amt: number } } = {};  // amount per carrier|container|currency|charge
  // which config row's "+ Add" picker is open (one at a time per row)
  showAdd: { [kind: string]: boolean } = {};
  // Description row whose Code picker is focused — its grid cell is lifted to the front
  // so the dropdown shows above the other rows/controls (focusin/focusout bubble, so this
  // works across browsers, unlike :focus-within).
  codeFocusRow = '';

  constructor(
    private mainService: QuotationTabularService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 25;
    this.page_current = 0;

    this.sub = this.route.queryParams.subscribe(params => {

      if (params['parameter'] != '') {
        this.InitCompleted = true;
        var options = JSON.parse(params['parameter']);
        this.menuid = options.menuid;
        if (options.type)
          this.type = options.type;



        this.InitComponent();
      }
    });

  }

  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitComponent() {
    this.IsAdmin = false;
    this.IsCompany = false;
    this.bPrint = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.IsAdmin = true;
      if (this.menu_record.rights_company)
        this.IsCompany = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
    this.LoadCombo();
  }

  LoadCombo() {
    this.loading = true;
    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      type: this.type,
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.FullTermList = response.termlist;
        this.List('NEW');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  // ----- LIST -------------------------------------------------------------

  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';                 // selecting a quote opens it directly editable
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }

  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;
    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == 'ADD' && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == 'EDIT' && this.menu_record.rights_edit)
      this.disableSave = false;
  }

  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      iscompany: this.IsCompany,
      isadmin: this.IsAdmin
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  // ----- NEW / LOAD -------------------------------------------------------

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new Mark_Qtnm();
    this.Record.qtnm_pkid = this.pkid;
    this.Record.qtnm_cfno = 0;
    this.Record.qtnm_no = '';
    this.Record.qtnm_type = this.type;      // PRD §3.5 discriminator
    this.Record.qtnm_to_id = '';
    this.Record.qtnm_to_code = '';
    this.Record.qtnm_to_br_id = '';
    this.Record.qtnm_to_br_no = '';
    this.Record.qtnm_cont_id = '';
    this.Record.qtnm_cont_code = '';
    this.Record.qtnm_to_name = '';
    this.Record.qtnm_to_addr1 = '';
    this.Record.qtnm_to_addr2 = '';
    this.Record.qtnm_to_addr3 = '';
    this.Record.qtnm_to_addr4 = '';
    this.Record.qtnm_date = this.gs.defaultValues.today;
    this.Record.qtnm_quot_by = '';
    this.Record.qtnm_validity = '';
    this.Record.qtnm_salesman_id = this.gs.globalVariables.sman_id;
    this.Record.qtnm_salesman_name = this.gs.globalVariables.sman_name;
    this.Record.qtnm_pol_id = '';
    this.Record.qtnm_pol_code = '';
    this.Record.qtnm_pol_name = '';
    this.Record.qtnm_pod_id = '';
    this.Record.qtnm_pod_code = '';
    this.Record.qtnm_pod_name = '';
    this.Record.qtnm_commodity = '';
    this.Record.qtnm_package = '';
    this.Record.qtnm_pcs = '';
    this.Record.qtnm_kgs = 0;
    this.Record.qtnm_cbm = 0;
    this.Record.qtnm_remarks = '';
    this.Record.rec_category = this.type;
    this.Record.rec_mode = this.mode;
    this.Record.qtnm_detList = new Array<Mark_Qtnd>();
    this.Record.qtnm_remList = new Array<GenRemarks>();
    this.NewRemarkRecord();           // start with one blank Note row
    this.GetTermsAndConditions();     // load the TABULAR terms template
    this.InitLov();                   // reset the Quote.To LOV pickers

    // empty grid; seed the local currency so the user has a starting column
    this.Carriers = [];
    this.Containers = [];
    this.Currencies = [];
    this.Refs = [];
    this.cells = {};
    this.currExrate = {};
    this.selectedCarrierId = '';
    if (this.gs.defaultValues.param_curr_local_id) {
      this.AddChip('CURRENCY', {
        id: this.gs.defaultValues.param_curr_local_id,
        code: this.gs.defaultValues.param_curr_local_code,
        name: this.gs.defaultValues.param_curr_local_code
      });
    }
  }

  GetRecord(Id: string) {
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord({ pkid: Id })
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

  LoadData(_Record: Mark_Qtnm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    if (this.gs.isBlank(this.Record.qtnm_detList))
      this.Record.qtnm_detList = new Array<Mark_Qtnd>();
    if (this.gs.isBlank(this.Record.qtnm_remList))
      this.Record.qtnm_remList = new Array<GenRemarks>();
    if (this.Record.qtnm_remList.length == 0)
      this.NewRemarkRecord();
    this.GetTermsAndConditions();     // load the TABULAR terms template

    // seed the Quote.To LOV pickers from the loaded record
    this.InitLov();
    this.CUSTRECORD.id = this.Record.qtnm_to_id;
    this.CUSTRECORD.code = this.Record.qtnm_to_code;
    this.CUSTADDRECORD.id = this.Record.qtnm_to_br_id;
    this.CUSTADDRECORD.code = this.Record.qtnm_to_br_no;
    this.CUSTADDRECORD.parentid = this.Record.qtnm_to_id;
    this.CONTRECORD.id = this.Record.qtnm_cont_id;
    this.CONTRECORD.code = this.Record.qtnm_cont_code;

    this.PivotDetail();
    // duplicate-quotation: keep the grid but start a fresh header
    if (this.mode == 'ADD') {
      this.Record.qtnm_pkid = this.pkid;
      this.Record.qtnm_cfno = 0;
      this.Record.qtnm_no = '';
      this.Record.qtnm_date = this.gs.defaultValues.today;
      this.Record.qtnm_validity = '';
    }
  }

  // TABULAR-QTN: tall MARK_QTND rows -> grid axes + cell store.
  PivotDetail() {
    this.Carriers = [];
    this.Containers = [];
    this.Currencies = [];
    this.Refs = [];
    this.cells = {};
    this.currExrate = {};

    let refByKey: { [k: string]: TabChip } = {};
    for (let rec of this.Record.qtnm_detList) {
      this.AddChip('CARRIER', { id: rec.qtnd_carrier_id, code: rec.qtnd_carrier_code, name: rec.qtnd_carrier_name });
      this.AddChip('CONTAINER', { id: rec.qtnd_cntr_type_id, code: rec.qtnd_cntr_type_code, name: rec.qtnd_cntr_type_code });
      this.AddChip('CURRENCY', { id: rec.qtnd_curr_id, code: rec.qtnd_curr_code, name: rec.qtnd_curr_code });
      this.currExrate[rec.qtnd_curr_id] = rec.qtnd_exrate || 1;

      // a charge row is identified by code + description (code may be blank)
      let rkey = rec.qtnd_acc_id + '|' + rec.qtnd_acc_name;
      let ref = refByKey[rkey];
      if (ref == null) {
        ref = { id: rec.qtnd_acc_id, code: rec.qtnd_acc_code, name: rec.qtnd_acc_name, rowid: this.gs.getGuid() };
        refByKey[rkey] = ref;
        this.Refs.push(ref);
      }
      this.GetCell(rec.qtnd_carrier_id, rec.qtnd_cntr_type_id, rec.qtnd_curr_id, ref.rowid).amt = rec.qtnd_amt;
    }
    if (this.Carriers.length > 0)
      this.selectedCarrierId = this.Carriers[0].id;
  }

  // ----- CONFIG PANEL (chips) --------------------------------------------

  ToggleAdd(_kind: string) {
    this.showAdd[_kind] = !this.showAdd[_kind];
  }

  listFor(_kind: string): TabChip[] {
    if (_kind == 'CARRIER') return this.Carriers;
    if (_kind == 'CONTAINER') return this.Containers;
    if (_kind == 'CURRENCY') return this.Currencies;
    return this.Refs;
  }

  AddChip(_kind: string, chip: TabChip) {
    if (chip == null || this.gs.isBlank(chip.id))
      return;
    let list = this.listFor(_kind);
    if (list.find(c => c.id == chip.id) != null)
      return;
    list.push({ id: chip.id, code: chip.code, name: chip.name, rowid: this.gs.getGuid() });
    if (_kind == 'CARRIER' && this.gs.isBlank(this.selectedCarrierId))
      this.selectedCarrierId = chip.id;
  }

  // axis chips (carrier / container / currency) — keep at least one column
  RemoveChip(_kind: string, _id: string) {
    let list = this.listFor(_kind);
    if (list.length <= 1)               // keep at least one (PRD §5)
      return;
    let i = list.findIndex(c => c.id == _id);
    if (i >= 0)
      list.splice(i, 1);
    if (_kind == 'CARRIER' && this.selectedCarrierId == _id && this.Carriers.length > 0)
      this.selectedCarrierId = this.Carriers[0].id;
  }

  // ----- DESCRIPTION ROWS (charges) — inline add / edit / delete in the grid -----

  AddRefRow() {
    this.Refs.push({ id: '', code: '', name: '', rowid: this.gs.getGuid() });
  }

  RemoveRefRow(rowid: string) {
    let i = this.Refs.findIndex(r => r.rowid == rowid);
    if (i >= 0)
      this.Refs.splice(i, 1);
  }

  // a charge (ACCTM) picked inline on a Description row — update that row in place
  RefPicked(_Record: any) {
    let ref = this.Refs.find(r => r.rowid == _Record.uid);
    if (ref == null)
      return;
    ref.id = _Record.id;
    ref.code = _Record.code;
    ref.name = _Record.name;
  }

  RefDescBlur(ref: TabChip) {
    if (ref.name)
      ref.name = ref.name.toUpperCase();
  }

  CodeFocus(rowid: string) {
    this.codeFocusRow = rowid;
  }

  // delay the reset so a click on a dropdown result lands before the cell drops back down
  CodeBlur() {
    setTimeout(() => { this.codeFocusRow = ''; }, 250);
  }

  RenameChip(_kind: string, chip: TabChip) {
    if (this.mode == 'VIEW')
      return;
    let newName = prompt('Rename', chip.name);   // local label only; master unchanged
    if (newName != null && newName.trim() != '')
      chip.name = newName.toUpperCase().trim();
  }

  // reset the three Quote.To LOV pickers (customer / address-branch / contact)
  InitLov() {
    this.CUSTRECORD = new SearchTable();
    this.CUSTRECORD.controlname = "QUOTE-TO";
    this.CUSTRECORD.displaycolumn = "CODE";
    this.CUSTRECORD.type = "CUSTOMER";
    this.CUSTRECORD.where = "";
    this.CUSTRECORD.id = "";
    this.CUSTRECORD.code = "";
    this.CUSTRECORD.name = "";

    this.CUSTADDRECORD = new SearchTable();
    this.CUSTADDRECORD.controlname = "QUOTE-TO-ADDR";
    this.CUSTADDRECORD.displaycolumn = "CODE";
    this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
    this.CUSTADDRECORD.id = "";
    this.CUSTADDRECORD.code = "";
    this.CUSTADDRECORD.name = "";
    this.CUSTADDRECORD.parentid = "";

    this.CONTRECORD = new SearchTable();
    this.CONTRECORD.controlname = "CONTACTS";
    this.CONTRECORD.displaycolumn = "CODE";
    this.CONTRECORD.type = "MARKETING CONTACT";
    this.CONTRECORD.where = "";
    this.CONTRECORD.id = "";
    this.CONTRECORD.code = "";
    this.CONTRECORD.name = "";
  }

  // fill the address lines for the selected customer branch (CUSTOMERADDRESS)
  SearchRecord(controlname: string, controlid: string, controlparentid: string) {
    if (controlid.trim().length <= 0)
      return;
    this.loading = true;
    let SearchData = {
      table: 'customeraddress',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      add_pkid: controlid,
      add_parent_id: controlparentid
    };
    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        if (controlname == 'CUSTOMERADDRESS') {
          this.Record.qtnm_to_addr1 = '';
          this.Record.qtnm_to_addr2 = '';
          this.Record.qtnm_to_addr3 = '';
          this.Record.qtnm_to_addr4 = '';
        }
        if (response.customeraddress.length > 0) {
          if (controlname == 'CUSTOMERADDRESS') {
            this.Record.qtnm_to_addr1 = response.customeraddress[0].add_line1;
            this.Record.qtnm_to_addr2 = response.customeraddress[0].add_line2;
            this.Record.qtnm_to_addr3 = response.customeraddress[0].add_line3;
            this.Record.qtnm_to_addr4 = response.customeraddress[0].add_line4;
          }
        }
        else {
          this.ErrorMessage = 'Invalid Address';
          alert(this.ErrorMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  // LOV selections (config-panel pickers + header lookups)
  LovSelected(_Record: any) {
    switch (_Record.controlname) {
      case 'TAB-CARRIER':
        this.AddChip('CARRIER', { id: _Record.id, code: _Record.code, name: _Record.name });
        if (!this.gs.isBlank(_Record.id))
          this.showAdd['CARRIER'] = false;   // item added -> show the + Add button again
        break;
      case 'TAB-CONTAINER':
        this.AddChip('CONTAINER', { id: _Record.id, code: _Record.code, name: _Record.code });
        if (!this.gs.isBlank(_Record.id))
          this.showAdd['CONTAINER'] = false;
        break;
      case 'TAB-CURRENCY':
        this.AddChip('CURRENCY', { id: _Record.id, code: _Record.code, name: _Record.code });
        if (!this.gs.isBlank(_Record.id)) {
          this.currExrate[_Record.id] = _Record.rate || 1;
          this.showAdd['CURRENCY'] = false;
        }
        break;
      case 'QUOTE-TO':
        if (this.Record.qtnm_to_id != _Record.id) {
          this.Record.qtnm_to_id = _Record.id;
          this.Record.qtnm_to_code = _Record.code;
          if (this.Record.qtnm_to_id) {
            this.Record.qtnm_to_name = _Record.name;
            this.Record.qtnm_to_addr1 = '';
            this.Record.qtnm_to_addr2 = '';
            this.Record.qtnm_to_addr3 = '';
            this.Record.qtnm_to_addr4 = '';

            this.CUSTADDRECORD = new SearchTable();
            this.CUSTADDRECORD.controlname = "QUOTE-TO-ADDR";
            this.CUSTADDRECORD.displaycolumn = "CODE";
            this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
            this.CUSTADDRECORD.id = "";
            this.CUSTADDRECORD.code = "";
            this.CUSTADDRECORD.name = "";
            this.CUSTADDRECORD.parentid = this.Record.qtnm_to_id;

            this.Record.qtnm_cont_id = '';
            this.Record.qtnm_cont_code = '';
            this.CONTRECORD = new SearchTable();
            this.CONTRECORD.controlname = "CONTACTS";
            this.CONTRECORD.displaycolumn = "CODE";
            this.CONTRECORD.type = "MARKETING CONTACT";
            this.CONTRECORD.where = "";
            this.CONTRECORD.id = "";
            this.CONTRECORD.code = "";
            this.CONTRECORD.name = "";
          }
        }
        break;
      case 'QUOTE-TO-ADDR':
        this.Record.qtnm_to_br_id = _Record.id;
        this.SearchRecord("CUSTOMERADDRESS", this.Record.qtnm_to_br_id, this.Record.qtnm_to_id);
        break;
      case 'CONTACTS':
        if (this.Record.qtnm_cont_id != _Record.id) {
          this.Record.qtnm_cont_id = _Record.id;
          this.Record.qtnm_cont_code = _Record.code;
          if (this.Record.qtnm_cont_id) {
            this.Record.qtnm_to_name = _Record.name;
            this.Record.qtnm_to_addr1 = _Record.col1;
            this.Record.qtnm_to_addr2 = _Record.col2;
            this.Record.qtnm_to_addr3 = _Record.col3;
            this.Record.qtnm_to_addr4 = '';

            this.Record.qtnm_to_id = '';
            this.Record.qtnm_to_code = '';
            this.CUSTRECORD = new SearchTable();
            this.CUSTRECORD.controlname = "QUOTE-TO";
            this.CUSTRECORD.displaycolumn = "CODE";
            this.CUSTRECORD.type = "CUSTOMER";
            this.CUSTRECORD.where = "";
            this.CUSTRECORD.id = "";
            this.CUSTRECORD.code = "";
            this.CUSTRECORD.name = "";
            this.Record.qtnm_to_br_id = '';
            this.CUSTADDRECORD = new SearchTable();
            this.CUSTADDRECORD.controlname = "QUOTE-TO-ADDR";
            this.CUSTADDRECORD.displaycolumn = "CODE";
            this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
            this.CUSTADDRECORD.id = "";
            this.CUSTADDRECORD.code = "";
            this.CUSTADDRECORD.name = "";
            this.CUSTADDRECORD.parentid = this.Record.qtnm_to_id;
          }
        }
        break;
      case 'SALESMAN':
        this.Record.qtnm_salesman_id = _Record.id;
        this.Record.qtnm_salesman_name = _Record.name;
        break;
      case 'POL':
        this.Record.qtnm_pol_id = _Record.id;
        this.Record.qtnm_pol_code = _Record.code;
        this.Record.qtnm_pol_name = _Record.name;
        break;
      case 'POD':
        this.Record.qtnm_pod_id = _Record.id;
        this.Record.qtnm_pod_code = _Record.code;
        this.Record.qtnm_pod_name = _Record.name;
        break;
    }
  }

  // ----- GRID CELLS -------------------------------------------------------

  CellKey(carrierId: string, contId: string, currId: string, accId: string): string {
    return carrierId + '~' + contId + '~' + currId + '~' + accId;
  }

  // returns a stable cell object so [(ngModel)] can bind to .amt
  // amt starts as null so the input shows blank (not a misleading 0) until a value is typed
  GetCell(carrierId: string, contId: string, currId: string, accId: string): { amt: number } {
    let key = this.CellKey(carrierId, contId, currId, accId);
    if (this.cells[key] == null)
      this.cells[key] = { amt: null };
    return this.cells[key];
  }

  // whole numbers only: drop any decimals the user typed into an amount cell
  CellAmtBlur(carrierId: string, contId: string, currId: string, accId: string) {
    let cell = this.GetCell(carrierId, contId, currId, accId);
    if (cell.amt != null && cell.amt !== ('' as any))
      cell.amt = Math.trunc(cell.amt);
  }

  // exchange rate comes from the currency master (set when the currency chip is added);
  // it is no longer entered in the grid.
  GetExrate(currId: string): number {
    let r = this.currExrate[currId];
    return (r && r > 0) ? r : 1;
  }

  // total for one carrier x container x currency column (sum over charges)
  GetColTotal(carrierId: string, contId: string, currId: string): number {
    let tot = 0;
    for (let ref of this.Refs)
      tot += this.GetCell(carrierId, contId, currId, ref.rowid).amt || 0;
    return this.gs.roundNumber(tot, 2);
  }

  // does this Description row have any amount entered across the grid?
  RefHasAmount(ref: TabChip): boolean {
    for (let carrier of this.Carriers)
      for (let cont of this.Containers)
        for (let curr of this.Currencies)
          if (this.GetCell(carrier.id, cont.id, curr.id, ref.rowid).amt)
            return true;
    return false;
  }

  // all carrier columns are editable in ADD/EDIT (no single-carrier restriction)
  IsCellEditable(carrierId: string): boolean {
    return this.mode == 'ADD' || this.mode == 'EDIT';
  }

  // ----- EDIT / SAVE ------------------------------------------------------

  // TABULAR-QTN: flatten the cell store back into one MARK_QTND per filled cell.
  BuildDetail() {
    let list: Mark_Qtnd[] = [];
    for (let carrier of this.Carriers) {
      for (let cont of this.Containers) {
        for (let curr of this.Currencies) {
          for (let ref of this.Refs) {
            if (this.gs.isBlank(ref.name))   // description required; skip empty rows
              continue;
            let amt = this.GetCell(carrier.id, cont.id, curr.id, ref.rowid).amt;
            if (amt == null || amt == 0)
              continue;
            let exrate = this.GetExrate(curr.id);
            let d = new Mark_Qtnd();
            d.qtnd_pkid = this.gs.getGuid();
            d.qtnd_parent_id = this.pkid;
            d.qtnd_type = 'CHARGE';
            d.qtnd_acc_id = ref.id;
            d.qtnd_acc_code = ref.code;
            d.qtnd_acc_name = ref.name;
            d.qtnd_carrier_id = carrier.id;
            d.qtnd_carrier_code = carrier.code;
            d.qtnd_carrier_name = carrier.name;      // display label (may be renamed) — persisted
            d.qtnd_cntr_type_id = cont.id;
            d.qtnd_cntr_type_code = cont.name;       // display label (may be renamed) — persisted
            d.qtnd_curr_id = curr.id;
            d.qtnd_curr_code = curr.name;            // display label (may be renamed) — persisted
            d.qtnd_qty = 1;
            d.qtnd_rate = amt;
            d.qtnd_amt = amt;
            d.qtnd_exrate = exrate;
            d.qtnd_total = this.gs.roundNumber(amt * exrate, 2);
            list.push(d);
          }
        }
      }
    }
    this.Record.qtnm_detList = list;
  }

  allvalid(): boolean {
    this.ErrorMessage = '';
    if (this.gs.isBlank(this.Record.qtnm_to_name)) {
      this.ErrorMessage = ' | Quote To Cannot be blank';
      return false;
    }
    if (this.Carriers.length == 0 || this.Containers.length == 0 ||
      this.Currencies.length == 0 || this.Refs.length == 0) {
      this.ErrorMessage = ' | Add at least one carrier, container, currency and charge';
      return false;
    }
    // description is mandatory for any row that has a rate entered (code is optional)
    for (let ref of this.Refs) {
      if (this.gs.isBlank(ref.name) && this.RefHasAmount(ref)) {
        this.ErrorMessage = ' | Description cannot be blank';
        return false;
      }
    }
    return true;
  }

  Save() {
    if (!this.allvalid()) {
      alert(this.ErrorMessage);
      return;
    }
    this.BuildDetail();
    if (this.Record.qtnm_detList.length == 0) {
      this.ErrorMessage = ' | Enter at least one rate';
      alert(this.ErrorMessage);
      return;
    }
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record.qtnm_type = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.qtnm_no = response.qtnslno;
          this.InfoMessage = 'New Quotation ' + this.Record.qtnm_no + ' Generated Successfully';
        } else
          this.InfoMessage = 'Save Complete';
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.Record.qtnm_detList = response.list;
        this.RefreshList();
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.qtnm_pkid == this.Record.qtnm_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    } else {
      REC.qtnm_no = this.Record.qtnm_no;
      REC.qtnm_date = this.Record.qtnm_date;
      REC.qtnm_to_name = this.Record.qtnm_to_name;
      REC.qtnm_quot_by = this.Record.qtnm_quot_by;
      REC.qtnm_pol_name = this.Record.qtnm_pol_name;
      REC.qtnm_pod_name = this.Record.qtnm_pod_name;
    }
  }

  OnBlur(field: string, _rec: any = null) {
    switch (field) {
      case 'gr_remarks':
        if (_rec) _rec.gr_remarks = (_rec.gr_remarks || '').toUpperCase();
        return;
      case 'qtnm_term':
        if (_rec) _rec.qtnm_remarks = (_rec.qtnm_remarks || '').toUpperCase();
        return;
      case 'qtnm_to_name':
        this.Record.qtnm_to_name = this.Record.qtnm_to_name.toUpperCase();
        break;
      case 'qtnm_quot_by':
        this.Record.qtnm_quot_by = this.Record.qtnm_quot_by.toUpperCase();
        break;
      case 'qtnm_commodity':
        this.Record.qtnm_commodity = this.Record.qtnm_commodity.toUpperCase();
        break;
      case 'qtnm_pol_name':
        this.Record.qtnm_pol_name = this.Record.qtnm_pol_name.toUpperCase();
        break;
      case 'qtnm_pod_name':
        this.Record.qtnm_pod_name = this.Record.qtnm_pod_name.toUpperCase();
        break;
      case 'qtnm_validity':
        this.Record.qtnm_validity = this.Record.qtnm_validity.toUpperCase();
        break;
      case 'qtnm_remarks':
        this.Record.qtnm_remarks = this.Record.qtnm_remarks.toUpperCase();
        break;
      case 'qtnm_kgs':
        this.Record.qtnm_kgs = this.gs.roundNumber(this.Record.qtnm_kgs, 3);
        break;
      case 'qtnm_cbm':
        this.Record.qtnm_cbm = this.gs.roundNumber(this.Record.qtnm_cbm, 3);
        break;
    }
  }

  // ----- NOTES (gen_remarks) + TERMS & CONDITIONS (captions) --------------

  AddRow(_type: string) {
    if (_type == 'REMARK')
      this.NewRemarkRecord();
    else
      this.NewTermRecord();
  }

  RemoveRow(_id: string, _type: string) {
    if (_type == 'REMARK') {
      this.Record.qtnm_remList.splice(this.Record.qtnm_remList.findIndex(rec => rec.gr_uid == _id), 1);
      if (this.Record.qtnm_remList.length == 0)
        this.NewRemarkRecord();
    } else {
      this.TermList.splice(this.TermList.findIndex(rec => rec.qtnm_pkid == _id), 1);
      if (this.TermList.length == 0)
        this.NewTermRecord();
    }
  }

  NewRemarkRecord() {
    let _Rec: GenRemarks = new GenRemarks;
    _Rec.gr_uid = this.gs.getGuid();
    _Rec.gr_pkid = this.pkid;
    _Rec.gr_type = 'QUOTATION';
    _Rec.gr_subtype = this.Record.qtnm_type;
    _Rec.gr_remarks = '';
    this.Record.qtnm_remList.push(_Rec);
  }

  NewTermRecord() {
    let _Rec: Mark_Qtnm = new Mark_Qtnm;
    _Rec.qtnm_pkid = this.gs.getGuid();
    _Rec.qtnm_remarks = '';
    this.TermList.push(_Rec);
  }

  // the terms template for this quotation type (TABULAR), filtered out of FullTermList
  GetTermsAndConditions() {
    this.TermList = new Array<Mark_Qtnm>();
    if (!this.gs.isBlank(this.FullTermList)) {
      for (let rec of this.FullTermList.filter(rec => rec.qtnm_type == this.Record.qtnm_type))
        this.TermList.push(rec);
    }
    if (this.TermList.length == 0)
      this.NewTermRecord();
  }

  SaveTerms() {
    let _saveData: SaveTermsData = new SaveTermsData;
    _saveData.qtnm_termList = this.TermList;
    _saveData.type = this.Record.qtnm_type;
    _saveData._globalvariables = this.gs.globalVariables;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.SaveTerms(_saveData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = 'Save Complete';
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  // ----- PDF PRINT (mirrors QuotationComponent) ---------------------------

  PrintQuotation() {
    this.loading = true;
    let SearchData = {
      pkid: this.Record.qtnm_pkid,
      type: 'PRINT',
      format: 'DETAIL',
      report_folder: this.gs.globalVariables.report_folder,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_name: this.gs.globalVariables.user_name
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintQuotation(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  CopyQuotation(_id: string, _qtnos: string) {
    if (!confirm('Copy Quotation ' + _qtnos))
      return;
    this.ActionHandler('ADD', '');
    this.GetRecord(_id);
  }

  Close() {
    this.gs.ClosePage('home');
  }
}
