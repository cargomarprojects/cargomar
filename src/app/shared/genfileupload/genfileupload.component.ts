import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { AlertService } from '../services/alert.service';
import { LovService } from '../services/lov.service';
import { Filesm } from '../models/filesm';

//CREATE-AJITH-01-10-2021

@Component({
  selector: 'app-genfileupload',
  templateUrl: './genfileupload.component.html'
})
export class GenFileUploadComponent {

  @Input() public pkid: string = '';
  @Input() public type: string = '';
  @Input() public menuid: string = '';
  @Input() public title: string = 'Documents';
  @Input() public canupload: boolean = true;

  ErrorMessage: string = '';
  InfoMessage: string = '';
  loading = false;
  myFiles: string[] = [];
  sMsg: string = '';
  FileNames: string = '';
  FileDisplayNames: string = '';
  FolderId: string = '';

  constructor(
    public gs: GlobalService,
    private lovService: LovService,
    private alertService: AlertService,
    private http2: HttpClient,
  ) {

  }

  @ViewChild('fileinput') private fileinput: ElementRef;
  RecordList: Filesm[] = [];
  filesSelected: boolean = false;;
  ngOnInit() {
    this.LoadCombo();
  }

  onChangeData(mid, _type) {
  }

  LoadCombo() {
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
      if (fname.indexOf(',') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%,#');
    } else
      this.uploadFiles();
  }


  uploadFiles() {

    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    this.loading = true;
    let frmData: FormData = new FormData();

    frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    frmData.append("PARENTID", this.gs.globalVariables.report_folder);
    frmData.append("GROUPID", 'EDI-SIGN-FILES');
    frmData.append("TYPE", this.type);
    frmData.append("DESC", '');
    frmData.append("CATGID", '');
    frmData.append("CREATEDBY", this.gs.globalVariables.user_code);
    frmData.append("ROOT-FOLDER", this.gs.defaultValues.root_folder);
    frmData.append("SUB-FOLDER", this.gs.defaultValues.sub_folder);
    frmData.append("APP_NAME", 'WEB');
    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          this.RecordList = data.flist;
          //alert('File Upload Complete');
        },
        error => {
          this.loading = false;
          alert('Error ' + this.gs.getError(error));
        }
      );
  }


  SignPdfFiles() {

    this.FileNames = "";
    this.FileDisplayNames = "";
    for (let rec of this.RecordList) {
      this.FolderId = rec.filefolderid;
      
      if (this.FileNames != "")
        this.FileNames += "*";
      this.FileNames += rec.filename;

      if (this.FileDisplayNames != "")
        this.FileDisplayNames += "*";
      this.FileDisplayNames += rec.filedisplayname;


    }

    if (this.gs.isBlank(this.FileNames)) {
      alert('Files Not Found');
      return;
    }
    if (this.gs.isBlank(this.FolderId)) {
      alert('Invalid Folder');
      return;
    }


//    SearchData.filename = this.FileNames;
  //  SearchData.folderid = this.FolderId;


    let SearchData = {
      type: '',
      subtype: '',
      filetype: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      filename : '',
      filedisplayname : '',
      company_code: '',
      branch_code: '',
      user_code: '',
      user_name: '',
      user_email : '',
      user_dsc_slno : '',
    }

    SearchData.pkid = this.pkid;
    SearchData.filetype = "PDF";
    SearchData.subtype = "SIGN PDF";
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.FolderId;
    SearchData.filename = this.FileNames;
    SearchData.filedisplayname = this.FileDisplayNames;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.user_name = this.gs.globalVariables.user_name;
    SearchData.user_email = this.gs.globalVariables.user_email;
    SearchData.user_dsc_slno = this.gs.globalVariables.user_dsc_slno;

    

    this.http2.post<any>( this.gs.baseUrl + '/api/Operations/Job/SignPdf', SearchData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          alert('Files Sent for Signing, pls check your email '+ this.gs.globalVariables.user_email   +' after few minutes');
        }, error => {
          this.loading = false;
          alert('Error ' + this.gs.getError(error));
        }
    );
    this.ErrorMessage = '';
    this.InfoMessage = '';
  }


  ShowFile(filename: string, filedisplayname: string = '') {
    if (filedisplayname == undefined || filedisplayname == '')
      filedisplayname = filename;
    this.Downloadfile(filename, "", filedisplayname);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


}
