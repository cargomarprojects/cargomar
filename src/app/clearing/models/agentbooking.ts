import { GlobalVariables } from '../../core/models/globalvariables';
import { Joborderm } from '../../Clearing/models/joborder';

export class AgentBookingm {

  ab_pkid: string;
  ab_book_no: number;
  ab_book_date: string;
  ab_agent_id: string;
  ab_agent_code: string;
  ab_agent_name: string;
  ab_exp_id: string;
  ab_exp_code: string;
  ab_exp_name: string;
  ab_imp_id: string;
  ab_imp_code: string;
  ab_imp_name: string;
  ab_approved: boolean;
  ab_type: string;
  ab_week_no: number;
  ab_week_status: string;
  ab_remarks: string;

  rec_mode: string;

  _globalvariables: GlobalVariables;

  OrderList: Joborderm[] = [];
}

