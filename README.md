# ResuMerge

> 宮下研究室発表会用レジュメ結合ツール

## Requirements

- PDFtk
  - [For Windows](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-win-setup.exe)
  - [For Mac](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg)
  - For Ubuntu | `apt install pdftk`
- Modern browser
  - e.g. Google Chrome, Firefox

## How to use

1. Google Forms で投稿フォームを作ります
    - 次の項目が必要です
      - 論文タイトル
      - 筆頭著者名
      - 学年（e.g. B4, M2）
      - 論文ファイル
    - 論文ファイルはアップロード機能を使います
      - Ref. https://gsuiteupdates-ja.googleblog.com/2017/07/google.html
2. Google Forms の回答を CSV にエクスポートします
    - Ref. https://support.google.com/docs/answer/139706?hl=ja
3. ファイルがアップロードされているフォルダを共有します
    - 「リンクを知っている全員」にします
4. ResuMerge を起動します
    - ダウンロードは[こちらから](./releases)
    - 手順に沿って項目を入力します

## For developers

1. Fork this repository
2. Clone and run `yarn`
3. When developing, run `yarn run watch`
  - Then, access to `http://localhost:9000`
4. When building releases, run `yarn run build`

## License
(c) 2017- Miyashita Lab

This software is released under the MIT License.
