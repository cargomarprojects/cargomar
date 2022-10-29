import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { ShipmentData } from '../models/shipmentdata';
import { ShipmentDataService } from '../services/shipmentdata.service';
import { Param } from '../../master/models/param';

@Component({
    selector: 'app-shipdata',
    templateUrl: './shipdata.component.html',
    providers: [ShipmentDataService]
})
export class ShipDataComponent {
    // Local Variables 
    title = 'Shipment Details';

    @Input() public type: string = '';
    @Input() menuid: string = '';

    menu_record: any;
    InitCompleted: boolean = false;
    disableSave = true;
    chkallselected: boolean = false;
    selectdeselect: boolean = false;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string;

    pkid: string;
    searchType: string = 'EXPORT';
    searchCustomer: string = '';
    searchAddress1: string = '';
    searchAddress2: string = '';
    searchAddress3: string = '';
    searchRegion: string = '';
    searchCity: string = '';
    searchRegionType: string = 'NA';
    searchCityType: string = 'NA';
    searchGroupBy: string = 'NA';

    updateRegion: string = '';
    updateCity: string = '';

    page_count: number = 0;
    page_current: number = 0;
    page_rowcount: number = 0;
    page_rows: number = 0;

    ErrorMessage = "";
    InfoMessage = "";
    RecordList: ShipmentData[] = [];
    RegionList: Param[] = [];
    FullCityList: Param[] = [];
    CityList: Param[] = [];
    constructor(
        private mainService: ShipmentDataService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = false;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
    }

    InitComponent() {
        if (this.InitCompleted)
            return;
        this.searchType = "EXPORT";
        this.searchRegionType = "NA";
        this.searchCityType = "NA";
        this.searchGroupBy = "NA";
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }
        this.InitLov();
        this.LoadCombo();
        this.InitCompleted = true;
    }

    InitLov() {
    }
    LovSelected(_Record: SearchTable) {
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        SearchData.comp_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RegionList = response.regionlist;
                this.FullCityList = response.citylist;
                this.CityList = new Array<Param>();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    // Save Data
    OnBlur(field: string) {
        if (field == 'searchCustomer') {
            this.searchCustomer = this.searchCustomer.toUpperCase();
        }
        if (field == 'searchAddress1') {
            this.searchAddress1 = this.searchAddress1.toUpperCase();
        }
        if (field == 'searchAddress2') {
            this.searchAddress2 = this.searchAddress2.toUpperCase();
        }
        if (field == 'searchAddress3') {
            this.searchAddress3 = this.searchAddress3.toUpperCase();
        }
        if (field == 'searchRegion') {
            this.searchRegion = this.searchRegion.toUpperCase();
        }
        if (field == 'searchCity') {
            this.searchCity = this.searchCity.toUpperCase();
        }
    }
    OnChange(field: string) {
        if (field == 'searchGroupBy') {
            this.RecordList = null;
        }
        if (field == 'updateRegion') {
            this.CityList = new Array<Param>();
            this.updateCity="";
            for (let rec of this.FullCityList.filter(rec => rec.param_id5_name == this.updateRegion)) {
                this.CityList.push(rec);
            }
        }
    }
    Close() {
        this.gs.ClosePage('home');
    }

    List(_type: string) {
        this.InfoMessage = "";
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
            type: _type,
            rowtype: this.type,
            report_folder: this.gs.globalVariables.report_folder,
            searchtype: this.searchType,
            customer: this.searchCustomer,
            address1: this.searchAddress1,
            address2: this.searchAddress2,
            address3: this.searchAddress3,
            region: this.searchRegion,
            city: this.searchCity,
            regiontype: this.searchRegionType,
            citytype: this.searchCityType,
            groupby: this.searchGroupBy,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.chkallselected = false;
                this.selectdeselect = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.RecordList) {
            rec.sd_selected = this.selectdeselect;
        }
    }

}
