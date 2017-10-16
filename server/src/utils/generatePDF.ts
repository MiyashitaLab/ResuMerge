import 'pdfjs-dist';
import axios from 'axios';
import * as PDFMake from 'pdfmake';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as moment from 'moment';
import 'moment/locale/ja';
import whichAsync from './whichAsync';
import { spawn } from 'child_process';

const printer = new PDFMake({
  Roboto: {
    normal: path.resolve(__dirname, '../../../fonts/SourceHanSerifJP-Regular.ttf'),
    bold: path.resolve(__dirname, '../../../fonts/SourceHanSerifJP-Bold.ttf'),
    italics: path.resolve(__dirname, '../../../fonts/SourceHanSerifJP-Regular.ttf'),
    bolditalics: path.resolve(__dirname, '../../../fonts/SourceHanSerifJP-Bold.ttf'),
  },
});

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

interface ResumeInfo extends ResumeInfoRaw {
  startPage: number;
  hash: string;
  insertEmpty: boolean;
}

const GRADE_LIST = ['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'D3'];

const GDriveFileIdRegExp = /([\w_-]{28,})/;
async function fetchFromGDriveURL(GDriveURL: string): Promise<ArrayBuffer> {
  if (!GDriveFileIdRegExp.test(GDriveURL)) {
    return Promise.reject(new Error('Invalid Google Drive URL.'));
  }
  const fileId = GDriveURL.match(GDriveFileIdRegExp)![1];
  return axios
    .request({
      method: 'GET',
      url: `https://docs.google.com/uc?id=${fileId}&export=download`,
      responseType: 'arraybuffer',
    })
    .then(({ data }) => data);
}

function createTableObjFromData(data: ResumeInfo, idx: number) {
  return [
    {
      text: idx === 0 ? data.grade : '',
      alignment: 'center',
      bold: true,
      margin: [0, 7.5],
      noWrap: true,
      lineHeight: 1.5,
    },
    {
      text: data.author,
      alignment: 'center',
      bold: true,
      margin: [0, 7.5],
      noWrap: true,
      lineHeight: 1.5,
    },
    {
      text: data.title,
      margin: [0, 7.5],
      lineHeight: 1.5,
    },
    {
      text: data.startPage.toString(10),
      alignment: 'right',
      noWrap: true,
      margin: [0, 7.5],
      lineHeight: 1.5,
    },
    {
      text: '',
      alignment: 'center',
      bold: true,
      margin: [5, 7.5],
      noWrap: true,
      lineHeight: 1.5,
    },
  ];
}

function getSchoolYear(dateNum: number) {
  const m = moment(dateNum);
  return m.year() - (m.month() <= 3 ? 1 : 0);
}

function getDateString(dateNum: number) {
  return moment(dateNum)
    .locale('ja')
    .format('YYYY年MM月DD日(ddd)');
}

function createTOCDefinitionObj(eventInfo: EventInfo, tableContent: any[]) {
  return {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 60],
    content: [
      {
        text: `${getSchoolYear(eventInfo.date)}年度`,
        bold: true,
        fontSize: 24,
        alignment: 'center',
      },
      {
        text: `${eventInfo.title} 配布資料`,
        bold: true,
        fontSize: 24,
        alignment: 'center',
      },
      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: 'auto',
            table: {
              body: [
                [
                  {
                    text: '日時 | ',
                  },
                  {
                    text: `${getDateString(eventInfo.date)} ${eventInfo.time}`,
                  },
                ],
                [
                  {
                    text: '場所 | ',
                  },
                  {
                    text: eventInfo.place,
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
          },
          {
            width: '*',
            text: '',
          },
        ],
        bold: true,
        fontSize: 12,
        margin: [0, 7.5],
      },
      {
        table: {
          dontBreakRows: true,
          widths: ['auto', 'auto', '*', 'auto', 'auto'],
          body: tableContent,
        },
        layout: {
          defaultBorder: false,
        },
        fontSize: 10.5,
      },
    ],
  };
}

async function createEmptyPDF(tmpDir: string) {
  const emptyPdf = printer.createPdfKitDocument({
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 60],
    content: [],
  });
  const emptyPdfStream = fs.createWriteStream(path.resolve(tmpDir, './empty.pdf'));
  emptyPdf.pipe(emptyPdfStream);
  emptyPdf.end();
  await new Promise(resolve => emptyPdfStream.on('close', resolve));
}

export default async function generatePDF(opts: GeneratePDFOptions, tmpDir: string, exportDir: string) {
  const resumeList: ResumeInfo[] = opts.resumeList
    .map(info => ({
      ...info,
      insertEmpty: false,
      startPage: -1,
      hash: crypto
        .createHash('sha1')
        .update(JSON.stringify(info))
        .digest('hex'),
    }))
    .filter((info, _idx, arr) => {
      return !arr.some(i => i.author === info.author && info.timestamp < i.timestamp);
    });

  await createEmptyPDF(tmpDir);

  const tableContent: any[] = [];
  let pageCount = 0;
  const sortedResumeList: ResumeInfo[] = [];
  for (const GRADE of GRADE_LIST) {
    const list = resumeList.filter(resume => resume.grade === GRADE);

    for (let idx = 0; idx < list.length; idx++) {
      const resume = list[idx];
      // Fetch PDF
      const PDFArrayBuffer = await fetchFromGDriveURL(resume.pdfUrl);
      await fs.writeFile(path.resolve(tmpDir, `./${resume.hash}.pdf`), PDFArrayBuffer);
      const doc = await PDFJS.getDocument(new Uint8Array(PDFArrayBuffer));
      const pages = doc.numPages;

      resume.startPage = pageCount + 1;
      pageCount += pages;
      if (pages % 2 === 1) {
        resume.insertEmpty = true;
        pageCount += 1;
      }

      sortedResumeList.push({ ...resume });
      tableContent.push(createTableObjFromData(resume, idx));
    }
  }

  const tocDefinitionObj = createTOCDefinitionObj(opts.eventInfo, tableContent);

  const tocPdf = printer.createPdfKitDocument(tocDefinitionObj);
  const tocPdfStream = fs.createWriteStream(path.resolve(tmpDir, './toc.pdf'));
  tocPdf.pipe(tocPdfStream);
  tocPdf.end();
  await new Promise(resolve => tocPdfStream.on('close', resolve));

  const headerFooterPdf = printer.createPdfKitDocument({
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 60],
    footer: (current: number) => ({
      text: current,
      fontSize: 10.5,
      alignment: 'center',
      margin: [40, 10, 40, 20],
    }),
    header: (current: number) => {
      const currentPDF = sortedResumeList.reverse().find(d => d.startPage <= current);
      if (!currentPDF) {
        return {
          text: '',
        };
      }
      const isFirstPage = currentPDF.startPage === current;
      return {
        text: isFirstPage
          ? ''
          : current % 2 === 0 ? `${getSchoolYear(opts.eventInfo.date)}年度 ${opts.eventInfo.title}` : currentPDF.title,
        fontSize: 10.5,
        alignment: 'center',
        margin: [40, 30, 40, 10],
      };
    },
    content: new Array(pageCount - 1).fill({
      text: '',
      pageBreak: 'after',
    }),
  });

  const headerFooterPdfStream = fs.createWriteStream(path.resolve(tmpDir, './stamp.pdf'));
  headerFooterPdf.pipe(headerFooterPdfStream);
  headerFooterPdf.end();
  await new Promise(resolve => headerFooterPdfStream.on('close', resolve));

  const concatArgs: string[] = [];
  sortedResumeList.forEach(resume => {
    concatArgs.push(path.resolve(tmpDir, `./${resume.hash}.pdf`));
    if (resume.insertEmpty) {
      concatArgs.push(path.resolve(tmpDir, './empty.pdf'));
    }
  });
  const concatPdftk = spawn((await whichAsync('pdftk'))!, [
    ...concatArgs,
    'cat',
    'output',
    path.resolve(tmpDir, './resume-concat.pdf'),
  ]);
  concatPdftk.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });
  concatPdftk.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });
  await new Promise(resolve => concatPdftk.on('close', resolve));

  const stampPdftk = spawn((await whichAsync('pdftk'))!, [
    path.resolve(tmpDir, './resume-concat.pdf'),
    'multistamp',
    path.resolve(tmpDir, './stamp.pdf'),
    'output',
    path.resolve(tmpDir, './resume-stamped.pdf'),
  ]);
  await new Promise(resolve => stampPdftk.on('close', resolve));

  let insertEmptyPageAfterTOC = false;
  const pdfBinary = await fs.readFile(path.resolve(tmpDir, './toc.pdf'));
  const pdfDoc = await PDFJS.getDocument(pdfBinary);
  if (pdfDoc.numPages % 2 !== 0) {
    insertEmptyPageAfterTOC = true;
  }

  const resultPdftk = spawn((await whichAsync('pdftk'))!, [
    path.resolve(tmpDir, './toc.pdf'),
    ...(insertEmptyPageAfterTOC ? [path.resolve(tmpDir, './empty.pdf')] : []),
    path.resolve(tmpDir, './resume-stamped.pdf'),
    'cat',
    'output',
    path.resolve(exportDir, './exported.pdf'),
  ]);
  await new Promise(resolve => resultPdftk.on('close', resolve));
}
