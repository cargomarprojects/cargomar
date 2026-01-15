
import { GlobalVariables } from '../../core/models/globalvariables';

export class CustomReportH {
    rh_pkid: string;
    rh_report_source: string;
    rh_report_format: string;
    recordDet: CustomReportD[] = [];
    rec_mode: string;
    _globalvariables: GlobalVariables;
}

export class CustomReportD {
    rd_pkid: string;
    rd_parent_id: string;
    rd_caption: string;
    rd_field: string;
    rd_selected: boolean;
    rd_ctr: number;
}