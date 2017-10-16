import PDF = require('pdfjs-dist');
declare global {
  const PDFJS: PDF.PDFJSStatic;
}
