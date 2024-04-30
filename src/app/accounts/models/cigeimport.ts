import { GlobalVariables } from '../../core/models/globalvariables';

export class CiGeImport {
    jvh_type: string;
    records: CiGeImportDet[];
    rec_created_by: string;
    rec_created_date: string;
    _globalvariables: GlobalVariables;
}

export class CiGeImportDet {
    orginvno: string;
    orginvdate: string;
    crnoterefno: string;
    crnoterefdate: string;
    debitcode: string;
    gstno: string;
    amt: string;
    creditcode: string;
    costcenter: string;
    costcentercode: string;
    status: string;
}
