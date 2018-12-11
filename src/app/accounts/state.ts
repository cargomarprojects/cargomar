
import { AppState } from '../reducers';

import { TrialReportState } from './trial/trial.reducer';

export interface AppState extends AppState {
    'trial': TrialReportState
}