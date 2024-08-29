import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() public uploadfilesize: number = 0;
  @Input() public uploadfiletype: string = '';

  public QrData: string = null;
  qrJson = {
    pkid: '',
    type: '',
    catg: '',
    desc: ''
  };

  title = 'Documents';

  ErrorMessage: string = '';
  InfoMessage: string = '';

  catg_id: string = '';
  desc: string = '';
  DocTypeList: any[] = [];

  copy_type: string = 'MBL-SE';
  copy_no: string = '';

  loading = false;
  myFiles: string[] = [];
  sMsg: string = '';

  mailType: string = '';
  sSubject: string = '';
  sMessage: string = '';
  sHtml: string = '';
  AttachList: any[] = [];
  modal: any;
  chkallselected: boolean = false;
  selectdeselect: boolean = false;
  uploadFileName: string = '';

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private lovService: LovService,
    private alertService: AlertService,
    private http2: HttpClient,
  ) {
    this.QrData = JSON.stringify(this.qrJson);
  }

  @ViewChild('fileinput') private fileinput: ElementRef;

  RecordList: documentm[] = [];

  RecordList2: documentm[] = [];

  filesSelected: boolean = false;;

  show_docs_list: boolean = false;




  ngOnInit() {

    this.LoadCombo();
    this.qrJson.pkid = this.pkid;
    this.qrJson.type = this.type;
    this.qrJson.catg = this.catg_id;
    this.QrData = JSON.stringify(this.qrJson);
    this.mailType = this.type + '-DOCMAIL';
  }

  onChangeData(mid, _type) {
    if (_type == 'catg')
      this.qrJson.catg = mid;
    if (_type == 'desc')
      this.qrJson.desc = mid;
    this.QrData = JSON.stringify(this.qrJson);
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

        this.qrJson.catg = this.catg_id;
        this.QrData = JSON.stringify(this.qrJson);


        this.List("NEW");
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }



  //Not used
  OldgetFileDetails(e: any) {
    //console.log (e.target.files);
    this.ErrorMessage = "";
    let isValidFile = true;
    let fname: string = '';
    let fsize: number = 0;
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;
      fname = e.target.files[i].name;
      fsize = e.target.files[i].size;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      if (fname.indexOf(',') >= 0)
        isValidFile = false;
      if (fname.indexOf('+') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%,+#');
    }

    if (!this.gs.isBlank(this.uploadfiletype) && this.filesSelected) {
      let str = "." + this.uploadfiletype;
      if (!fname.toUpperCase().endsWith(str)) {
        this.ErrorMessage = "Invalid File Type, Only " + this.uploadfiletype + " File Allowed";
        alert(this.ErrorMessage);
      }
    }

    if (!this.gs.isZero(this.uploadfilesize) && this.filesSelected) {
      let uplodfsize = this.uploadfilesize * 1024;
      if (fsize > uplodfsize) {
        this.ErrorMessage = "File Size must be less than or equal to " + this.ConvertKB2MB(this.uploadfilesize);
        alert(this.ErrorMessage);
      }
    }
  }

  getFileDetails(e: any) {
    this.getFileList(e.target.files);
  }

  getFileList(_files: any[] = []) {
    if (this.gs.isBlank(_files)) {
      return;
    }
    this.uploadFileName = '';
    this.ErrorMessage = "";
    let isValidFile = true;
    let fname: string = '';
    let fsize: number = 0;
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < _files.length; i++) {
      this.filesSelected = true;
      fname = _files[i].name;
      fsize = _files[i].size;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      if (fname.indexOf(',') >= 0)
        isValidFile = false;
      if (fname.indexOf('+') >= 0)
        isValidFile = false;
      this.myFiles.push(_files[i]);

      if (this.uploadFileName != '')
        this.uploadFileName += ', ';
      this.uploadFileName += fname;
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%,+#');
    }

    if (!this.gs.isBlank(this.uploadfiletype) && this.filesSelected) {
      let str = "." + this.uploadfiletype;
      if (!fname.toUpperCase().endsWith(str)) {
        this.ErrorMessage = "Invalid File Type, Only " + this.uploadfiletype + " File Allowed";
        alert(this.ErrorMessage);
      }
    }

    if (!this.gs.isZero(this.uploadfilesize) && this.filesSelected) {
      let uplodfsize = this.uploadfilesize * 1024;
      if (fsize > uplodfsize) {
        this.ErrorMessage = "File Size must be less than or equal to " + this.ConvertKB2MB(this.uploadfilesize);
        alert(this.ErrorMessage);
      }
    }
  }

  uploadFiles() {

    if (!this.gs.isBlank(this.ErrorMessage)) {
      alert(this.ErrorMessage);
      return;
    }

    if (this.gs.defaultValues.root_folder == '') {
      alert('Root Folder is blank');
      return;
    }


    if (this.gs.defaultValues.sub_folder == '') {
      alert('Root Folder is blank');
      return;
    }

    if (this.catg_id == '') {
      alert('Pls Select Category');
      return;
    }

    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }


    const itm = this.DocTypeList.find(rec => rec.param_pkid == this.catg_id);
    if (!itm) {
      alert('Pls Select Category');
      return;
    }

    if (itm.param_name == 'OTHER' || itm.param_name == 'OTHERS') {
      if (this.desc == '') {
        alert('Description Cannot Be Blank');
        return;
      }
    }




    this.loading = true;

    let frmData: FormData = new FormData();


    frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    frmData.append("PARENTID", this.pkid);
    frmData.append("GROUPID", this.groupid);
    frmData.append("TYPE", this.type);
    frmData.append("DESC", this.desc);
    frmData.append("CATGID", this.catg_id);
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
          this.uploadFileName = '';
          this.desc = '';
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
      group_id: this.groupid,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder,
      year_code: this.gs.globalVariables.year_code,
    };




    this.lovService.DocumentList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.chkallselected = false;
        this.selectdeselect = false;
        this.RecordList = response.list;
        // for (let rec of this.RecordList) {
        //   rec.row_displayed=false;
        // }
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }


  ShowFile(filename: string, filedisplayname: string = '') {
    if (filedisplayname == undefined || filedisplayname == '')
      filedisplayname = filename;
    this.Downloadfile(filename, "", filedisplayname);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  ShowFile2(filename: string, filedisplayname: string = '') {
    if (filedisplayname == undefined || filedisplayname == '')
      filedisplayname = filename;
    this.Downloadfile2(filename, "", filedisplayname);
  }

  Downloadfile2(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFileFromLocalhost(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  ShowEdiUpdate(_rec: documentm) {
    if (_rec.doc_pkid == null)
      return;
    if (_rec.doc_pkid !== '') {
      _rec.row_displayed = !_rec.row_displayed;
    }
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


  showFiles() {

    this.loading = true;

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      copy_type: this.copy_type,
      copy_no: this.copy_no,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder,
      year_code: this.gs.globalVariables.year_code,
    };

    this.lovService.ExtraList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList2 = response.list;
        this.show_docs_list = true;
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }

  CopyFiles() {

    this.loading = true;

    var id = '';
    for (let itm of this.RecordList2) {
      if (itm.doc_selected) {
        if (id != "")
          id += ",";
        id += "'" + itm.doc_pkid + "'";
      }
    }


    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      pkids: id,
      parentid: this.pkid,
      type: this.type,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder,
      year_code: this.gs.globalVariables.year_code,
      created_by: this.gs.globalVariables.user_code
    };

    this.lovService.CopyFiles(SearchData)
      .subscribe(response => {
        this.loading = false;

        this.List('LIST');

      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });

  }

  ConvertKB2MB(_fsize: number) {
    let strsize: string = "";
    if (_fsize < 1024)
      strsize = _fsize.toString() + "KB";
    else {
      let _newfsize = (_fsize / 1024.00);
      _newfsize = this.gs.roundNumber(_newfsize, 2);
      _newfsize = Math.ceil(_newfsize);
      if (_newfsize < 1024)
        strsize = _newfsize.toString() + "MB";
      else
        strsize = _newfsize.toString() + "GB";
    }
    return " " + strsize;
  }

  MailDocument(mailmodal: any) {
    this.AttachList = new Array<any>();
    let _dSize = 0;
    for (let rec of this.RecordList.filter(rec => rec.doc_selected == true)) {
      _dSize = this.getFsize(rec.doc_file_size);
      this.AttachList.push({ filename: rec.doc_full_name, filetype: '', filedisplayname: rec.doc_file_name, filesize: _dSize });
    }
    this.setMailBody();
    this.open(mailmodal);
  }

  setMailBody() {

    this.sSubject = "DOCUMENTS";

    this.sMessage = "Dear Sir/Madam,";
    this.sMessage += " \n\n";
    this.sMessage += "Please find the attached documents;";

  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  chkReset(_rec: documentm) {
    _rec.doc_selected = !_rec.doc_selected;
  }

  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.RecordList) {
      rec.doc_selected = this.selectdeselect;
    }
  }

  getFsize(_size: string) {
    let _newSize: number = 0;
    try {
      var temparr = _size.split(' ');
      _newSize = +temparr[0] * 1024;
    } catch (Error) {
      _newSize = 0;
    }
    return _newSize;
  }

  DeleteRecords() {

    var id = "";
    for (let itm of this.RecordList) {
      if (itm.doc_selected) {
        if (id != "")
          id += ",";
        id += itm.doc_pkid;
      }
    }

    if (id == "") {
      this.ErrorMessage = "No Records are selected";
      alert(this.ErrorMessage);
      return;
    }

    if (!confirm("Do you want to delete selected records")) {
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: id,
      type: this.type,
      parentid: this.pkid,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.lovService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.add('drag-over');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('drag-over');
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('drag-over');

    this.getFileList(event.dataTransfer.files);

    // this.dragFileName = '';
    // for (var i = 0; i < event.dataTransfer.files.length; i++) {
    //   this.dragFileName += event.dataTransfer.files[i].name
    // }
    // this.fileinput.nativeElement.value = '';

  }


}
