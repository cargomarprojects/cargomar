import { GlobalVariables } from '../../core/models/globalvariables';

export class ImpJobm {
  impj_pkid: string;
  impj_parent_id: string;
  impj_be_type: string;
  impj_docs_required: string;
  impj_edichklst_sent_on: string;
  impj_status: string;
  impj_status_date: string;
  impj_cleared_on: string;
  impj_doc_recvd_date: string;
  impj_doc_send_date: string;
  impj_waybill_no: string;
  impj_waybill_date: string;
  impj_edi_no: number;
  impj_sbno: string;
  impj_sbdate: string;
  impj_remarks: string;

  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
}
