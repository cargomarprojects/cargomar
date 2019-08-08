import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

import { Companym } from '../models/company';
import { Yearm } from '../models/yearm';

import { Settings } from '../models/settings';

@Component({
    selector: 'app-loginbranch',
    templateUrl: './loginbranch.component.html'
})
export class LoginBranchComponent {
    ErrorMessage: string;
    loading = false;

    showlogin = false;
    
    branchid : string = '';
    yearid: string = '';

    username = '';
    password = '';

    public gs: GlobalService;

    BranchList: Companym[] = [];
    YearList: Yearm[] = [];

    constructor(
        private router: Router,
        private location: Location,
        private gs1: GlobalService,
        private loginservice: LoginService) {

        this.gs = gs1;

        this.branchid = this.gs.globalVariables.user_branch_id;
        this.LoadCombo();
    }

    LoadCombo() {
        this.loading = true;
        let SearchData = {
            userid: this.gs.globalVariables.user_pkid,
            usercode: this.gs.globalVariables.user_code,
            compid: this.gs.globalVariables.user_company_id,
            compcode: this.gs.globalVariables.user_company_code

        };

        this.loginservice.LoadBranch(SearchData)
            .subscribe(response => {
                this.BranchList = response.branchlist;
                this.YearList = response.yearlist;

                if (this.branchid == '')
                {
                    this.BranchList.forEach(rec => {
                        this.branchid = rec.comp_pkid;
                    });
                }
                this.YearList.forEach(rec => {
                    this.yearid = rec.year_pkid;
                });

                this.loading = false;
                this.showlogin = true;
            },
            error => {
                this.loading = false;
                this.showlogin = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }

    LoadMenu() {
        let SearchData = {
            userid: this.gs.globalVariables.user_pkid,
            usercode: this.gs.globalVariables.user_code,
            compid: this.gs.globalVariables.user_company_id,
            compcode: this.gs.globalVariables.user_company_code,
            branchid: this.branchid,
            yearid: this.yearid,
            ipaddress : this.gs.globalVariables.ipaddress,
            tokenid  : this.gs.globalVariables.tokenid           
        };

        if (this.branchid == '') {
            this.ErrorMessage = 'Branch Not Selected';
            return;
        }

        if (this.yearid == '') {
            this.ErrorMessage = 'Year Not Selected';
            return;
        }

        this.loading = true;

        this.loginservice.LoadMenu(SearchData)
            .subscribe(response => {
                this.gs.IsAuthenticated = true;
                this.loading = false;

                this.gs.MenuList = response.list;
                this.gs.Modules = response.modules;

                let data = response.data;

                let airjob = response.airjob;
                let seajob = response.seajob;
                let seajobcntr = response.seajobcntr;
                let foreigncurr = response.foreigncurr;
                let payrollsetting = response.payrollsetting;

                this.gs.globalVariables.comp_pkid = data.comp_pkid;
                this.gs.globalVariables.comp_code = data.comp_code;
                this.gs.globalVariables.comp_name = data.comp_name;

                this.gs.Company_Name = data.comp_name;

                this.gs.globalVariables.branch_pkid = data.branch_pkid;
                this.gs.globalVariables.branch_code = data.branch_code;
                this.gs.globalVariables.branch_name = data.branch_name;

                this.gs.globalVariables.branch_type = data.branch_type;


                this.gs.globalVariables.year_pkid = data.year_pkid;
                this.gs.globalVariables.year_code = data.year_code;
                this.gs.globalVariables.year_name = data.year_name;
                this.gs.globalVariables.year_prefix = data.year_prefix;

                this.gs.globalVariables.year_start_date = data.year_start_date;
                this.gs.globalVariables.year_end_date = data.year_end_date;
                this.gs.globalVariables.year_end_date = data.year_end_date;
                this.gs.globalVariables.year_closed = data.year_closed;

                this.gs.globalVariables.report_folder = data.report_folder;

                this.gs.InitdefaultValues();
                this.initDefaults(response.settings);

                //Air Export Job Default Loading 
                this.gs.defaultValues.air_job_place_receipt_id = airjob.job_place_receipt_id;
                this.gs.defaultValues.air_job_place_receipt_code = airjob.job_place_receipt_code;
                this.gs.defaultValues.air_job_place_receipt_name = airjob.job_place_receipt_name;
                this.gs.defaultValues.air_job_pre_carriage_id = airjob.job_pre_carriage_id;
                this.gs.defaultValues.air_job_pre_carriage_code = airjob.job_pre_carriage_code;
                this.gs.defaultValues.air_job_pre_carriage_name = airjob.job_pre_carriage_name;
                this.gs.defaultValues.air_job_origin_state_id = airjob.job_origin_state_id;
                this.gs.defaultValues.air_job_origin_state_code = airjob.job_origin_state_code;
                this.gs.defaultValues.air_job_origin_state_name = airjob.job_origin_state_name;
                this.gs.defaultValues.air_job_pol_id = airjob.job_pol_id;
                this.gs.defaultValues.air_job_pol_code = airjob.job_pol_code;
                this.gs.defaultValues.air_job_pol_name = airjob.job_pol_name;
                this.gs.defaultValues.air_job_cha_id = airjob.job_cha_id;
                this.gs.defaultValues.air_job_cha_code = airjob.job_cha_code;
                this.gs.defaultValues.air_job_cha_name = airjob.job_cha_name;
                this.gs.defaultValues.air_job_agent_id = airjob.job_agent_id;
                this.gs.defaultValues.air_job_agent_code = airjob.job_agent_code;
                this.gs.defaultValues.air_job_agent_name = airjob.job_agent_name;
                this.gs.defaultValues.air_job_commodity_id = airjob.job_commodity_id;
                this.gs.defaultValues.air_job_commodity_code = airjob.job_commodity_code;
                this.gs.defaultValues.air_job_commodity_name = airjob.job_commodity_name;
                this.gs.defaultValues.air_job_edi_id = airjob.job_edi_id;
                this.gs.defaultValues.air_job_edi_code = airjob.job_edi_code;
                this.gs.defaultValues.air_job_edi_name = airjob.job_edi_name;
                this.gs.defaultValues.air_job_nature = airjob.job_nature;
                this.gs.defaultValues.air_job_terms = airjob.job_terms;
                this.gs.defaultValues.air_job_status = airjob.job_status;
                this.gs.defaultValues.air_job_cargo_nature = airjob.job_cargo_nature;
                this.gs.defaultValues.air_job_marks = airjob.job_marks;
                this.gs.defaultValues.air_job_origin_country_id = airjob.job_origin_country_id;
                this.gs.defaultValues.air_job_origin_country_code = airjob.job_origin_country_code;
                this.gs.defaultValues.air_job_origin_country_name = airjob.job_origin_country_name;


                //Sea Export Job Default Loading 
                this.gs.defaultValues.sea_job_place_receipt_id = seajob.job_place_receipt_id;
                this.gs.defaultValues.sea_job_place_receipt_code = seajob.job_place_receipt_code;
                this.gs.defaultValues.sea_job_place_receipt_name = seajob.job_place_receipt_name;
                this.gs.defaultValues.sea_job_pre_carriage_id = seajob.job_pre_carriage_id;
                this.gs.defaultValues.sea_job_pre_carriage_code = seajob.job_pre_carriage_code;
                this.gs.defaultValues.sea_job_pre_carriage_name = seajob.job_pre_carriage_name;
                this.gs.defaultValues.sea_job_origin_state_id = seajob.job_origin_state_id;
                this.gs.defaultValues.sea_job_origin_state_code = seajob.job_origin_state_code;
                this.gs.defaultValues.sea_job_origin_state_name = seajob.job_origin_state_name;
                this.gs.defaultValues.sea_job_pol_id = seajob.job_pol_id;
                this.gs.defaultValues.sea_job_pol_code = seajob.job_pol_code;
                this.gs.defaultValues.sea_job_pol_name = seajob.job_pol_name;
                this.gs.defaultValues.sea_job_cha_id = seajob.job_cha_id;
                this.gs.defaultValues.sea_job_cha_code = seajob.job_cha_code;
                this.gs.defaultValues.sea_job_cha_name = seajob.job_cha_name;
                this.gs.defaultValues.sea_job_agent_id = seajob.job_agent_id;
                this.gs.defaultValues.sea_job_agent_code = seajob.job_agent_code;
                this.gs.defaultValues.sea_job_agent_name = seajob.job_agent_name;
                this.gs.defaultValues.sea_job_commodity_id = seajob.job_commodity_id;
                this.gs.defaultValues.sea_job_commodity_code = seajob.job_commodity_code;
                this.gs.defaultValues.sea_job_commodity_name = seajob.job_commodity_name;
                this.gs.defaultValues.sea_job_edi_id = seajob.job_edi_id;
                this.gs.defaultValues.sea_job_edi_code = seajob.job_edi_code;
                this.gs.defaultValues.sea_job_edi_name = seajob.job_edi_name;
                this.gs.defaultValues.sea_job_nature = seajob.job_nature;
                this.gs.defaultValues.sea_job_terms = seajob.job_terms;
                this.gs.defaultValues.sea_job_status = seajob.job_status;
                this.gs.defaultValues.sea_job_cargo_nature = seajob.job_cargo_nature;
                this.gs.defaultValues.sea_job_marks = seajob.job_marks;
                this.gs.defaultValues.sea_job_origin_country_id = seajob.job_origin_country_id;
                this.gs.defaultValues.sea_job_origin_country_code = seajob.job_origin_country_code;
                this.gs.defaultValues.sea_job_origin_country_name = seajob.job_origin_country_name;

              //Sea Export Job Container Default Loading
                this.gs.defaultValues.sea_jobcntr_sealtype = seajobcntr.cntr_sealtype;

              //foreign currency details
                this.gs.defaultValues.param_curr_foreign_fwdrate = foreigncurr.param_rate;
                this.gs.defaultValues.param_curr_foreign_clrrate = foreigncurr.param_id1;

                //Payroll settings details
                this.gs.defaultValues.pf_col_excluded = payrollsetting.ps_pf_col_excluded;
                this.gs.defaultValues.pf_percent = payrollsetting.ps_pf_per;
                this.gs.defaultValues.pf_limit = payrollsetting.ps_pf_cel_limit;
                this.gs.defaultValues.esi_emply_percent = payrollsetting.ps_esi_emply_per;
                this.gs.defaultValues.esi_limit = payrollsetting.ps_esi_limit;
                this.gs.defaultValues.pf_cel_limit_amt = payrollsetting.ps_pf_cel_limit_amt;
                this.gs.defaultValues.pf_emplr_pension_per = payrollsetting.ps_pf_emplr_pension_per;
                this.gs.defaultValues.pf_br_region = payrollsetting.ps_pf_br_region;

                if (this.gs.globalVariables.comp_pkid == '') {
                    this.ErrorMessage = "Invalid Company";
                    return;
                }
                if (this.gs.globalVariables.branch_pkid == '') {
                    this.ErrorMessage = "Invalid Branch";
                    return;
                }

                if (this.gs.globalVariables.year_pkid == '')
                {
                    this.ErrorMessage = "Invalid Fin-Year";
                    return;
                }

                this.router.navigate(['home'],{ replaceUrl: true });
            },
            error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    
    }

    Close() {
        this.gs.IsLoginSuccess = false;
        this.gs.ClosePage('login');
    }

    initDefaults(settingslist : Settings[]) {
      settingslist.forEach(rec => {
        if (rec.parentid == this.gs.globalVariables.comp_code) {
          if (rec.caption == 'UNIT-PCS') {
            this.gs.defaultValues.param_unit_pcs_id = rec.id;
            this.gs.defaultValues.param_unit_pcs_code = rec.code;
          }
          if (rec.caption == 'UNIT-KGS') {
            this.gs.defaultValues.param_unit_kgs_id = rec.id;
            this.gs.defaultValues.param_unit_kgs_code = rec.code;
          }
          if (rec.caption == 'UNIT-CTN') {
            this.gs.defaultValues.param_unit_ctn_id = rec.id;
            this.gs.defaultValues.param_unit_ctn_code = rec.code;
          }
          if (rec.caption == 'LOCAL-CURRENCY') {
            this.gs.defaultValues.param_curr_local_id= rec.id;
            this.gs.defaultValues.param_curr_local_code = rec.code;
          }
          if (rec.caption == 'FOREIGN-CURRENCY') {
            this.gs.defaultValues.param_curr_foreign_id = rec.id;
            this.gs.defaultValues.param_curr_foreign_code = rec.code;
          }

          if (rec.caption == 'ROOT-FOLDER')
          this.gs.defaultValues.root_folder = rec.name;

          if (rec.caption == 'SUB-FOLDER')
          this.gs.defaultValues.sub_folder = rec.name;

          
          if (rec.caption == 'BL-REG-NO')
            this.gs.defaultValues.bl_reg_no = rec.name;

          if (rec.caption == 'BL-ISSUED-BY1')
            this.gs.defaultValues.bl_issued_by1 = rec.name;
          if (rec.caption == 'BL-ISSUED-BY2')
            this.gs.defaultValues.bl_issued_by2 = rec.name;
          if (rec.caption == 'BL-ISSUED-BY3')
            this.gs.defaultValues.bl_issued_by3 = rec.name;
          if (rec.caption == 'BL-ISSUED-BY4')
            this.gs.defaultValues.bl_issued_by4 = rec.name;
          if (rec.caption == 'BL-ISSUED-BY5')
            this.gs.defaultValues.bl_issued_by5 = rec.name;

        }
        if (rec.parentid == this.gs.globalVariables.branch_code) {
          if (rec.caption == 'GSTIN')
            this.gs.defaultValues.gstin = rec.name;
          if (rec.caption == 'GST-STATE')
            this.gs.defaultValues.gstin_state_code = rec.code;
          if (rec.caption == 'BL-ISSUED-PLACE')
            this.gs.defaultValues.bl_issued_place = rec.name;
          if (rec.caption == 'DOC-PREFIX')
            this.gs.defaultValues.doc_prefix = rec.name;
          if (rec.caption == 'CHQ_PRINT_HO_APRVD')
            this.gs.defaultValues.print_cheque_only_after_ho_approved = rec.name;
        }
        

      });
    }


}

