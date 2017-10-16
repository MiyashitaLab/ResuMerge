import { Dispatch } from 'redux';
import * as parseCSV from 'csv-parse';
import { actions as errorsActions } from './errors';
import { actions as phaseActions } from './phase';
import { readFileAsync } from '../helpers/readFileAsync';

export const ActionType = {
  IMPORT_CSV: 'IMPORT_CSV' as 'IMPORT_CSV',
};
type ImportCSVAction = {
  type: typeof ActionType.IMPORT_CSV;
  payload: {
    headers: string[];
    data: any[];
  };
};
function importCSV(file: File) {
  return async (dispatch: Dispatch<any>) => {
    await errorsActions.resetErrors()(dispatch);
    if (!checkCSV(file)) {
      errorsActions.throwErrors([
        {
          code: 'UPLOAD_INVALID_TYPE_FILE',
          message: 'CSV ファイルをアップロードしてください',
        },
      ])(dispatch);
      return;
    }

    let CSVString: string;
    try {
      CSVString = await readFileAsync(file, 'utf8');
    } catch (err) {
      errorsActions.throwErrors([
        {
          code: 'FAILED_READING_CSV',
          message: 'CSV ファイルの読み込みに失敗しました',
        },
      ])(dispatch);
      return;
    }

    let data: any[];
    try {
      data = (await parseCSVAsync(CSVString)) as any[];
    } catch (err) {
      errorsActions.throwErrors([
        {
          code: 'FAILED_PARSING_CSV',
          message: 'CSV ファイルのパースに失敗しました',
        },
      ])(dispatch);
      return;
    }

    if (!data.length || !(data.length > 0)) {
      return errorsActions.throwErrors([
        {
          code: 'EMPTY_CSV',
          message: 'CSV ファイルが空です',
        },
      ])(dispatch);
    }

    const headers = Object.keys(data[0]);
    if (headers.length < 5) {
      return errorsActions.throwErrors([
        {
          code: 'INVALID_HEADER_LENGTH',
          message: 'CSV ファイルのヘッダーの数が足りません',
        },
      ])(dispatch);
    }

    await dispatch<ImportCSVAction>({
      type: ActionType.IMPORT_CSV,
      payload: { data, headers },
    });
    await phaseActions.changePhase('SETUP_CSV_HEADER')(dispatch);
  };
}

function checkCSV(file: File) {
  const isCSV = /\.csv$/.test(file.name) && ['text/csv', 'application/vnd.ms-excel'].indexOf(file.type) !== -1;
  return isCSV;
}

async function parseCSVAsync(str: string) {
  return new Promise((resolve, reject) => {
    return parseCSV(str, { columns: true }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

export const actions = {
  importCSV,
};

export type Action = ImportCSVAction;
