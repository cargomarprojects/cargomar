import { GlobalVariables } from '../../core/models/globalvariables';

export class CiGeImport {
    jvh_type: string;
    jvh_subtype: string;
    jvh_headerdrcr: string;
    branch_gstin_state_code: string;
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
    debitcodegstno: string;
    amt: string;
    creditcode: string;
    creditcodegstno: string;
    costcenter: string;
    costcentercode: string;
    status: string;
    addressbrno: string;
    gstper: string;
    refno: string;
    refdate: string;
    paidto: string;
    payreason: string;
    roundoff: string;
    roundoffcode: string;
    roundoffdrcr: string;
    taxableamt: string;
}
