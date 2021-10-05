import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { printformatm } from '../models/printformatm';
import { printformatd } from '../models/printformatd';
import { BlFormterService } from '../services/blformater.service';
import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-05-10-2021

@Component({
  selector: 'app-blformater',
  templateUrl: './blformater.component.html',
  providers: [BlFormterService]
})
export class BlFormaterComponent {
  /*
  Ajith 01/06/2019 format copy implemented
  */
  // Local Variables 
  title = 'BL Format';

  @ViewChild('addressComponent') addressComponent: any;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  copyto_typename: string = '';
  copyto_branch_id: string = '';
  copyto_branch_code: string = '';

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  BRRECORD: SearchTable = new SearchTable();

  // Array For Displaying List
  RecordList: printformatm[] = [];
  // Single Record for add/edit/view details
  Record: printformatm = new printformatm;


  RecordListDet: printformatd[] = [];
  record: printformatd;

  selectedItem = -1;
  btnx = 0;
  btny = 0;

  mouseX = 0;
  mouseY = 0;

  destX = 0;
  destY = 0;

  remarks = '';

  ht = 1200;
  wd = 900;

  constructor(
    private mainService: BlFormterService,
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

  ngAfterViewInit() {
    this.InitCanvas();
    
  }

  InitCanvas(){
    this.getCanvas();
    this.drawPage();
  }

  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    //  this.LoadCombo();
    this.InitLov();
    this.List("NEW");
  }

  InitLov() {
    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = "";
  }
  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "BRANCH") {
      this.copyto_branch_id = _Record.id;
      this.copyto_branch_code = _Record.code;
    }
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }



  LoadCombo() {

    //this.loading = true;
    //let SearchData = {
    //  type: 'type',
    //  comp_code: this.gs.globalVariables.comp_code,
    //  branch_code: this.gs.globalVariables.branch_code
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //  .subscribe(response => {
    //    this.loading = false;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });

    this.List("NEW");
  }

  //function for handling LIST/NEW/EDIT Buttons
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
      this.InitCanvas();
      this.mode = 'EDIT';
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
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
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
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new printformatm();
    this.Record.blf_pkid = this.pkid;
    this.Record.blf_type = '';
    this.Record.blf_name = '';

    this.Record.rec_mode = this.mode;

  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.list);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: printformatm) {
    this.Record = _Record;

    this.RecordListDet = _Record.FormatList;

    this.Record.rec_mode = this.mode;
  }

  changepos(pos: string, rec: printformatd) {
    if (pos == 'left') {
      rec.blf_col_x = rec.blf_col_x - 8;
    }
    if (pos == 'right') {
      rec.blf_col_x = rec.blf_col_x + 8;
    }
    if (pos == 'up') {
      rec.blf_col_y = rec.blf_col_y - 15;
    }
    if (pos == 'down') {
      rec.blf_col_y = rec.blf_col_y + 15;
    }
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
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.Record.blf_type.trim().length <= 0) {
      bret = false;
      sError = " | Invalid Type";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.blf_pkid == this.Record.blf_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.blf_type = this.Record.blf_type;
      REC.blf_name = this.Record.blf_name;

    }
  }


  OnBlur(field: string, rec: printformatd) {
    if (field == 'blf_col_x') {

    }
    if (field == 'blf_col_y') {

    }
    if (field == 'copyto_typename') {
      this.copyto_typename = this.copyto_typename.toLocaleUpperCase();
    }

  }
  GetSpaceTrim(str: string) {
    let num: number;
    let strTrim = {
      newstr: ''
    };
    if (str.trim() != "") {
      var temparr = str.split(' ');
      for (num = 0; num < temparr.length; num++) {
        strTrim.newstr = strTrim.newstr.concat(temparr[num]);
      }
    }
    return strTrim;
  }

  Close() {
    this.gs.ClosePage('home');
  }

  Copy(_id: string) {

    // this.GetRecord(_id);
    // return;

    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (_id.length <= 0) {
      this.ErrorMessage += "| Invalid ID ";
    }
    if (this.copyto_typename.length <= 0) {
      this.ErrorMessage += "| Type Name Cannot be blank. ";
    }
    if (this.copyto_branch_code.length <= 0) {
      this.ErrorMessage += "| Please select a branch and continue....... ";
    }
    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

    let Msg: string = "";
    Msg = "Do you want to Copy ? ";
    if (!confirm(Msg)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: _id,
      type: "COPY",
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      copyto_branch_code: this.copyto_branch_code,
      copyto_typename: this.copyto_typename,
      copyto_type: this.Record.blf_type
    };

    this.mainService.CopyFormat(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.copyto_branch_code = '';
        this.copyto_branch_id = '';
        this.copyto_typename = '';
        this.InfoMessage = "Save Complete";
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  AddRow(_id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_id.length <= 0) {
      this.ErrorMessage += "| Invalid ID ";
    }
    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

    let Msg: string = "";
    Msg = "Do you want to  Add Row ? ";
    if (!confirm(Msg)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: _id,
      type: "ADD",
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      copyto_branch_code: this.copyto_branch_code,
      copyto_typename: this.copyto_typename,
      copyto_type: this.Record.blf_type
    };

    this.mainService.CopyFormat(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.copyto_branch_code = '';
        this.copyto_branch_id = '';
        this.copyto_typename = '';
        this.InfoMessage = "Save Complete";
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }



  getPos(x: number) {
    let tot = x * this.mainService.zoom;
    return tot.toString() + "px";
  }

  onKeydown(event: KeyboardEvent, _rec: printformatd) {
    console.log(event.key);
    this.disableScrolling();
    var _factor = 1;
    if (event.key === "ArrowDown") {
      _rec.blf_col_y += _factor;
    }
    if (event.key === "ArrowUp") {
      _rec.blf_col_y -= _factor;
    }
    if (event.key === "ArrowLeft") {
      _rec.blf_col_x -= _factor;
    }
    if (event.key === "ArrowRight") {
      _rec.blf_col_x += _factor;
    }
  }
  onKeyup(event: KeyboardEvent, _rec: printformatd) {
    this.enableScrolling();
  }


  btnClick(evt, _rec: printformatd) {
    this.btnx = evt.x;
    this.btny = evt.y;
    this.setRemarks();
  }

  setRemarks() {
    var str = "";
    str = "Pos : (" + this.btnx.toString() + "," + this.btny.toString();
    str += ")-(" + this.mouseX.toString() + "," + this.mouseY.toString() + ")";
    this.remarks = str;
  }

  onDragStart(evt, _rec: printformatd, i: number) {
    this.record = _rec;
    this.selectedItem = i;
    this.btnx = evt.x;
    this.btny = evt.y;

    this.setRemarks();
  }

  allowDrop(evt) {
    this.mouseX = evt.x;
    this.mouseY = evt.y;
    this.setRemarks();
    evt.preventDefault();
  }

  onDrop(evt) {
    if (this.selectedItem == -1)
      return;
    this.setRemarks();
    var x = 0;
    var y = 0;
    if (evt.x > this.btnx) {
      x = (evt.x - this.btnx) / this.mainService.zoom;
      this.record.blf_col_x = this.record.blf_col_x + x;
    }
    if (evt.x < this.btnx) {
      x = (this.btnx - evt.x) / this.mainService.zoom;
      this.record.blf_col_x = this.record.blf_col_x - x;
    }

    if (evt.y > this.btny) {
      y = (evt.y - this.btny) / this.mainService.zoom;
      this.record.blf_col_y = this.record.blf_col_y + y;
    }
    if (evt.y < this.btny) {
      y = (this.btny - evt.y) / this.mainService.zoom;
      this.record.blf_col_y = this.record.blf_col_y - y;
    }
    this.destX = x;
    this.destY = y;
    this.setRemarks();
    this.selectedItem = -1;
  }

  getCanvas() {
    if (this.canvas)
      this.ctx = this.canvas.nativeElement.getContext('2d');
      console.log(this.ctx);
  }

  drawPage() {
    if (!this.ctx)
      return;
    this.ctx.beginPath();
    //this.ctx.fillStyle = 'gray';
    this.ctx.lineWidth = 0.1;
    for (var k = 0; k <= this.wd; k += 50) {
      this.ctx.moveTo(k, 0);
      this.ctx.lineTo(k, this.ht);
    }

    for (var k = 0; k <= this.ht; k += 50) {
      this.ctx.moveTo(0, k);
      this.ctx.lineTo(this.wd, k);
    }

    this.ctx.stroke();
  }

  disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
  }

  enableScrolling() {
    window.onscroll = function () { };
  }

}
