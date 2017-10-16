import axios from 'axios';

async function checkHTTPStatusCode(url: string = 'https://example.com') {
  return axios
    .head(url, {
      validateStatus: () => true,
      maxRedirects: 0,
    })
    .then(({ status }) => status)
    .catch(() => null);
}

export default checkHTTPStatusCode;
