
import { GlobalVariables } from '../../core/models/globalvariables';

export class Emp {
  emp_pkid: string;
  emp_no: string;
  emp_name: string;
  emp_alias: string;
  emp_father_name: string;
  emp_spouse_name: string;
  emp_blood_group: string;
  emp_local_address1: string;
  emp_local_address2: string;
  emp_local_address3: string;
  emp_local_city: string;
  emp_local_state_id: string;
  emp_local_pin: string;
  emp_local_pobox: string;
  emp_local_country_id: string;
  emp_home_address1: string;
  emp_home_address2: string;
  emp_home_address3: string;
  emp_home_city: string;
  emp_home_state_id: string;
  emp_home_pin: string;
  emp_home_pobox: string;
  emp_home_country_id: string;
  emp_tel_resi: string;
  emp_tel_office: string;
  emp_mobile: string;
  emp_mobile_office: string;
  emp_email_personal: string;
  emp_email_office: string;
  emp_bank_acno: string;
  emp_bank_name: string;
  emp_bank_branch: string;
  emp_ifsc_code: string;
  emp_pfno: string;
  emp_esino: string;
  emp_pan: string;
  emp_adhar_no: string;
  emp_uan_no: string;
  emp_fuel_type: string;
  emp_fuel_limit: number;
  emp_bus_limit: number;
  emp_train_limit: number;
  emp_vehi_maint_limit: number;
  emp_drive_vehi_type: string;
  emp_mobile_limit: number;
  emp_datacard_limit: string;
  emp_branch_id: string;
  emp_branch_code: string;
  emp_grade_id: string;
  emp_department_id: string;
  emp_designation_id: string;
  emp_status_id: string;
  emp_in_payroll: boolean;
  emp_marital_status: string;
  emp_gender: string;
  emp_comp_mediclaim: boolean;
  emp_premium_amt: number;
  emp_mediclaim_provider: string;
  emp_remarks: string;
  emp_do_birth: string;
  emp_marrige_date: string;
  emp_do_joining: string;
  emp_do_confirmation: string;
  emp_do_relieve: string;
  emp_is_relieved: boolean;
  emp_trans_date: string;
  emp_branch_name: string;
  emp_company_id: string;
  emp_branch_group: number;
  emp_is_retired: boolean;
  emp_in_csv: boolean;
  emp_incentive_type: string;
  emp_incentive_type_id: string;
  emp_edit_code: string;

  rec_mode: string;
  rec_branch_code: string;

  _globalvariables: GlobalVariables;
}

export class EmpDocs {
  doc_pkid: string;
  doc_code: string;
  doc_name: string;
  doc_group: string;
  doc_file_type: string;
  doc_file_size: number;
  doc_file_size2: string;
  doc_count: number;
}