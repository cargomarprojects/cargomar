import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';



import { HttpClient } from '@angular/common/http';


import { GlobalService } from '../../core/services/global.service';
import { AlertService } from '../services/alert.service';
import { LovService } from '../services/lov.service';

import { documentm } from '../models/documentm';

@Component({
  selector: 'app-upload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent {

  @Input() public pkid: string = '';
  @Input() public groupid: string = '';
  @Input() public type: string = '';
  @Input() public canupload: boolean = true;
  @Input() public defaultdoctype: string = '';

  title = 'Documents';

  ErrorMessage: string = '';
  InfoMessage: string = '';

  catg_id: string = '';
  DocTypeList: any[] = [];

  loading = false;
  myFiles: string[] = [];
  sMsg: string = '';

  constructor(
    private gs: GlobalService,
    private lovService: LovService,
    private alertService: AlertService,
    private http2: HttpClient,
  ) {

  }

  @ViewChild('fileinput') private fileinput: ElementRef;

  RecordList: documentm[] = [];

  filesSelected: boolean = false;;

  ngOnInit() {
    this.LoadCombo();
  }


  LoadCombo() {

    let sid: string = '';
    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code


    };


    this.lovService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.DocTypeList = response.dtlist;
        if (this.DocTypeList != null) {
          var REC = this.DocTypeList.find(rec => rec.param_name == this.defaultdoctype);
          if (REC != null) {
            sid = REC.param_pkid;
          }
        }
        if (sid == '') {
          this.DocTypeList.forEach(Rec => {
            sid = Rec.param_pkid;
          });
        }

        this.catg_id = sid;

        this.List("NEW");
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }




  getFileDetails(e: any) {
    //console.log (e.target.files);
    let isValidFile = true;
    let fname: string = '';
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;
      fname = e.target.files[i].name;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%#');
    }
  }


  uploadFiles() {


    if (this.catg_id == '') {
      alert('Pls Select Category');
      return;
    }

    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    this.loading = true;

    let frmData: FormData = new FormData();


    frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    frmData.append("PARENTID", this.pkid);
    frmData.append("GROUPID", this.groupid);
    frmData.append("TYPE", this.type);
    frmData.append("CATGID", this.catg_id);
    frmData.append("CREATEDBY", this.gs.globalVariables.user_code);


    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          this.List('NEW');
          alert('Upload Complete');
        },
        error => {
          this.loading = false;
          alert('Failed');
        }
      );
  }




  List(_type: string, _subtype: string = '') {

    this.loading = true;

    let SearchData = {
      type: this.type,
      subtype: _subtype,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      parent_id: this.pkid,
      group_id: this.groupid
    };




    this.lovService.DocumentList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }


  ShowFile(filename: string) {
    this.Downloadfile(filename, "", filename);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  RemoveList(event: any) {

    if (!event.selected) {
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: event.id,
      type: this.type,
      parentid: this.pkid,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.lovService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.doc_pkid == this.pkid), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



}
