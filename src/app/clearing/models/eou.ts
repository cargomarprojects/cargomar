import { GlobalVariables } from '../../core/models/globalvariables';

export class Eou {
  eou_job_id: string;

  eou_exp_id: string;
  eou_exp_code: string;
  eou_exp_name: string;

  eou_br_id: string;
  eou_br_no: string;

  eou_date: string;
  eou_exam_officer_name: string;
  eou_exam_officer_desg: string;
  eou_super_name: string;
  eou_super_desg: string;
  eou_commissionerate: string;
  eou_division: string;
  eou_range: string;
  eou_items_verified: boolean;
  eou_sample_forwarded: boolean;
  eou_sealno: string;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

