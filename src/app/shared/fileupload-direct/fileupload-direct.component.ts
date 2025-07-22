import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-fileupload-direct',
    templateUrl: './fileupload-direct.component.html'
})
export class FileUploadDirectComponent {

    @Input() public pkid: string = '';
    @Input() public groupid: string = '';
    @Input() public type: string = '';
    @Input() public desc: string = '';
    @Input() public defaultdoctype: string = '';
    @Input() public uploadfilesize: number = 0;
    @Input() public uploadfiletype: string = '';
    @Output() callbackevent = new EventEmitter<any>();

    title = 'Documents';
    ErrorMessage = "";
    catg_id: string = '';
    copy_no: string = '';
    parentid: string = '';
    loading = false;
    myFiles: string[] = [];
    modal: any;

    uploadFileName: string = '';
    uploadedFilesName: string = '';
    uploadedFilesPath: string = '';
    bDragged: boolean = false;
    constructor(
        private modalService: NgbModal,
        public gs: GlobalService,
        private http2: HttpClient,
    ) {
    }

    @ViewChild('_fileinput') private fileinput: ElementRef;
    filesSelected: boolean = false;;
    ngOnInit() {
        this.LoadCombo();
    }

    LoadCombo() {

        // this.catg_id = sid;

    }


    GetFiles(fileuplodmodal: any = null) {
        this.uploadFileName = '';
        this.uploadedFilesName = '';
        this.uploadedFilesPath = '';
        this.open(fileuplodmodal);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    oldgetFileDetails(e: any) {
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

    //using while drag enabled
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
            this.uploadFileName = '';
            alert('Invalid File Name - &%,+#');
        }

        if (!this.gs.isBlank(this.uploadfiletype) && this.filesSelected) {
            let str = "." + this.uploadfiletype;
            if (!fname.toUpperCase().endsWith(str)) {
                this.uploadFileName = '';
                this.ErrorMessage = "Invalid File Type, Only " + this.uploadfiletype + " File Allowed";
                alert(this.ErrorMessage);
            }
        }

        if (!this.gs.isZero(this.uploadfilesize) && this.filesSelected) {
            let uplodfsize = this.uploadfilesize * 1024;
            if (fsize > uplodfsize) {
                this.uploadFileName = '';
                this.ErrorMessage = "File Size must be less than or equal to " + this.ConvertKB2MB(this.uploadfilesize);
                alert(this.ErrorMessage);
            }
        }

    }

    uploadFiles() {

        if (!this.gs.isBlank(this.ErrorMessage)) {
            // alert(this.ErrorMessage);
            return;
        }

        if (this.gs.defaultValues.root_folder == '') {
            alert('Root Folder is blank');
            return;
        }


        if (this.gs.defaultValues.sub_folder == '') {
            alert('Sub Folder is blank');
            return;
        }

        // if (this.catg_id == '') {
        //     alert('Pls Select Category');
        //     return;
        // }

        if (!this.filesSelected) {
            alert('No File Selected');
            return;
        }
         
        // const itm = this.DocTypeList.find(rec => rec.param_pkid == this.catg_id);
        // if (!itm) {
        //     alert('Pls Select Category');
        //     return;
        // }

        // if (itm.param_name == 'OTHER' || itm.param_name == 'OTHERS') {
        //     if (this.desc == '') {
        //         alert('Description Cannot Be Blank');
        //         return;
        //     }
        // }

        this.loading = true;
        let frmData: FormData = new FormData();

        frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
        frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
        frmData.append("PARENTID", this.pkid);
        frmData.append("GROUPID", "DOWNLOAD-DIRECT");
        frmData.append("TYPE", this.type);
        frmData.append("DESC", this.desc);
        frmData.append("CATGID", this.catg_id);
        frmData.append("CREATEDBY", this.gs.globalVariables.user_code);

        frmData.append("ROOT-FOLDER", this.gs.defaultValues.root_folder);
        frmData.append("SUB-FOLDER", this.gs.defaultValues.sub_folder);
        frmData.append("REPORT-FOLDER", this.gs.globalVariables.report_folder);

        frmData.append("APP_NAME", 'WEB');

        for (var i = 0; i < this.myFiles.length; i++) {
            frmData.append("fileUpload", this.myFiles[i]);
        }
        this.http2.post<any>(
            this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
                data => {
                    this.loading = false;
                    this.filesSelected = false;
                    this.uploadedFilesName = data.filedisplayname;
                    this.uploadedFilesPath = data.filename;
                    this.uploadFileName = '';
                    this.desc = '';
                    this.bDragged = false;
                    if (!this.gs.isBlank(this.fileinput))
                        this.fileinput.nativeElement.value = '';

                    if (this.callbackevent) {
                        this.callbackevent.emit({ action: 'UPLOAD', filename: this.uploadedFilesPath, filedisplayname: this.uploadedFilesName });
                        this.modal.close();
                    }

                },
                error => {
                    this.loading = false;
                    if (this.gs.isBlank(this.gs.getError(error)))
                        alert('Failed');
                    else
                        alert(this.gs.getError(error));
                }
            );
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

    onDragOver(event: any) {
        event.preventDefault();
        event.stopPropagation();
        const dropArea = event.currentTarget as HTMLElement;
        dropArea.classList.add('drag-over');
        this.bDragged = true;
    }

    onDragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        const dropArea = event.currentTarget as HTMLElement;
        dropArea.classList.remove('drag-over');
        this.bDragged = false;
    }

    onDrop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        const dropArea = event.currentTarget as HTMLElement;
        dropArea.classList.remove('drag-over');
        if (event.dataTransfer.files.length > 1) {
            alert('Multiple files not allowed');
            this.bDragged = false;
            return;
        }
        this.getFileList(event.dataTransfer.files);
        this.bDragged = false;
    }

    CloseModal(_type: string) {
        // if (_type == "OK") {
        //     if (this.gs.isBlank(this.uploadFilePath)) {
        //         alert('No File Selected');
        //         return;
        //     }
        //     if (this.callbackevent) {
        //         this.callbackevent.emit({ action: 'UPLOAD', filename: this.uploadFilePath, filedisplayname: this.uploadFileName });
        //         this.modal.close();
        //     }
        // } else
        //     this.modal.close();


        if (_type == "UPLOAD") {
            this.uploadFiles();
        } else
            this.modal.close();
    }
}