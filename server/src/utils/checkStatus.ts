import whichAsync from './whichAsync';
import checkHTTPStatusCode from './checkHTTPStatusCode';
import ERROR from './ERROR_CODE';

const ErrorList = {
  pdftk: {
    code: ERROR.PDFTK_IS_NOT_FOUND,
    message: 'PDFTK をインストールしてください',
  },
  online: {
    code: ERROR.NO_INTERNET,
    message: 'インターネット接続を確認してください',
  },
};

export default async function checkStatus() {
  const errors = [];

  const status = {
    pdftk: (await whichAsync('pdftk')) != null,
    online: (await checkHTTPStatusCode()) === 200,
  };
  if (!status.pdftk) {
    errors.push(ErrorList.pdftk);
  }
  if (!status.online) {
    errors.push(ErrorList.online);
  }

  if (errors.length === 0) {
    return {};
  } else {
    return { errors, status: 503 };
  }
}
