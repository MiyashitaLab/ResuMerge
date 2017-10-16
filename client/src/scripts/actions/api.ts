import { Dispatch } from 'redux';
import axios from 'axios';
import * as moment from 'moment';
import 'moment/locale/ja';
import { RootState } from '../reduces';
import { actions as errorsActions } from './errors';
import { actions as phaseActions } from './phase';
import { wait } from '../helpers/wait';

function fetchServerStatus() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const [result] = await Promise.all([
        axios.get('/api/status', {
          validateStatus: () => true,
          timeout: 3000,
        }),
        wait(3000),
      ]);
      if (result.status !== 200) {
        await errorsActions.throwErrors(result.data.errors)(dispatch);
      } else {
        await phaseActions.changePhase('IMPORT_CSV')(dispatch);
      }
    } catch (err) {
      await errorsActions.throwErrors([
        {
          code: 'SERVER_ERROR',
          message: '<致命的なエラー> サーバを再起動してください',
        },
      ])(dispatch);
    }
  };
}

interface GeneratePDFOptions {
  resumeList: ResumeInfoRaw[];
  eventInfo: EventInfo;
}

interface EventInfo {
  title: string;
  date: number;
  time: string;
  place: string;
}

interface ResumeInfoRaw {
  timestamp: number;
  title: string;
  author: string;
  grade: string;
  pdfUrl: string;
}

function generatePDF() {
  return async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const headerBind = state.config.csv.headerBind;

    errorsActions.resetErrors()(dispatch);

    try {
      const mappedResumeList = state.csv.data.map((info: any) => {
        const mapped: any = {};
        Object.keys(headerBind).forEach(key => {
          mapped[key] = info[headerBind[key]!];
          if (key === 'timestamp') {
            mapped[key] = moment(mapped[key], 'YYYY/MM/DD hh:mm:ss a GMTZ', 'ja').valueOf();
          }
        });
        return mapped as ResumeInfoRaw;
      });
      const payload: GeneratePDFOptions = {
        eventInfo: {
          ...state.config.event,
          date: state.config.event.date!.getTime(),
        } as EventInfo,
        resumeList: mappedResumeList,
      };

      const { data, status } = await axios.post('/api/make', payload, {
        validateStatus: () => true,
      });

      if (status !== 200) {
        await errorsActions.throwErrors(data.errors)(dispatch);
        return;
      }
      await phaseActions.changePhase('GENERATED_PDF')(dispatch);
    } catch (err) {
      await errorsActions.throwErrors([
        {
          code: 'SERVER_ERROR',
          message: '<致命的なエラー> サーバを再起動してください',
        },
      ])(dispatch);
    }
  };
}

export const actions = {
  fetchServerStatus,
  generatePDF,
};
