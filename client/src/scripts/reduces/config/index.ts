import { combineReducers } from 'redux';
import csv, { CSVConfigState } from './csv';
import event, { EventConfigState } from './event';

export type ConfigState = {
  csv: CSVConfigState;
  event: EventConfigState;
};

export default combineReducers<ConfigState>({
  csv,
  event,
});
