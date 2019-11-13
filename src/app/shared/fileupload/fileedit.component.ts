import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { documentm } from '../models/documentm';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-fileedit',
  templateUrl: './fileedit.component.html',
})

export class FileEditComponent {
  // Local Variables 
  title = '';

  @Input() record: documentm;
  @Input() DocTypeList: any[] = [];

  pkid: string = '';


  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";
  oldFileExtn: string = '';

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.pkid = this.record.doc_pkid;
    this.oldFileExtn = this.getFileExtension(this.record.doc_file_name);
  }

  InitComponent() {

  }


  // Save Data
  Save() {
    /*
    if (!this.allvalid())
      return;
    */
    this.ErrorMessage = '';
    if (this.record.doc_file_name == '') {
      this.ErrorMessage = 'File Name Cannot Be Empty';
      return;
    }

    if (this.record.doc_catg_id == '') {
      this.ErrorMessage = 'Type Cannot Be Empty';
      return;
    }

    let newFileExtn: string = this.getFileExtension(this.record.doc_file_name);
    if (this.oldFileExtn != newFileExtn) {
      this.ErrorMessage = 'File Extension Mismatch';
      return;
    }

    this.SearchRecord("DOCUMENTUPDATE", "SAVE");
  }


  SearchRecord(controlname: string, _type: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.record.doc_pkid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: this.record.doc_pkid,
      catgid: this.record.doc_catg_id,
      filename: this.record.doc_file_name,
      table: 'documentupdate',
      type: _type,
      root_folder: ''
    };

    SearchData.pkid = this.record.doc_pkid;
    SearchData.catgid = this.record.doc_catg_id;
    SearchData.filename = this.record.doc_file_name;
    SearchData.table = 'documentupdate';
    SearchData.root_folder = this.gs.defaultValues.root_folder;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        this.ErrorMessage = response.errormsg;
        if (response.status == "OK") {
          {
            if (this.DocTypeList != null) {
              var REC = this.DocTypeList.find(rec => rec.param_pkid == SearchData.catgid);
              if (REC != null) {
                this.record.doc_catg_name = REC.param_name;
              }
            }
            this.record.doc_full_name = response.newfilename;
            this.record.row_displayed = false;
          }
        }
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


    //if (bret === false)
    //  this.ErrorMessage = sError;
    return bret;
  }


  Close() {
    this.record.row_displayed = false;
  }

  getFileExtension(_fname: string) {
    var temparr = _fname.split('.');
    let extn: string = '';
    if (temparr.length > 1)
      extn = temparr[temparr.length - 1];
    return extn;
  }

}
