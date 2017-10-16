import { combineReducers } from 'redux';
import phase, { PhaseState } from './phase';
import errors, { ErrorsState } from './errors';
import csv, { CSVState } from './csv';
import config, { ConfigState } from './config';

export type RootState = {
  phase: PhaseState;
  errors: ErrorsState;
  csv: CSVState;
  config: ConfigState;
};

export default combineReducers<RootState>({
  phase,
  errors,
  csv,
  config,
});
