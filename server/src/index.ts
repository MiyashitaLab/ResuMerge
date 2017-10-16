import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static';
import * as path from 'path';
import * as tmp from 'tmp';
import * as opn from 'opn';

tmp.setGracefulCleanup();
const exportDir = tmp.dirSync({
  unsafeCleanup: true,
});
console.log(exportDir.name);

import ERROR from './utils/ERROR_CODE';
import checkStatus from './utils/checkStatus';
import generatePDF from './utils/generatePDF';

const app = new Koa();
const apiRouter = new Router({
  prefix: '/api',
});

// Error Handling
apiRouter.use(async (ctx, next) => {
  await next();
  if (ctx.body.errors) {
    ctx.status = ctx.body.status || 500;
  }
});

apiRouter.get('/status', async ctx => {
  ctx.body = await checkStatus();
});

apiRouter.post('/make', async ctx => {
  const tmpDir = tmp.dirSync({
    unsafeCleanup: true,
  });
  try {
    await generatePDF(ctx.request.body, tmpDir.name, exportDir.name);
    ctx.body = {};
  } catch (err) {
    ctx.body = {
      errors: [
        {
          code: 'GENERATE_PDF_ERROR',
          message: 'PDF の生成に失敗しました',
          internal: err.message,
        },
      ],
    };
  }
  tmpDir.removeCallback();
});

apiRouter.use(async ctx => {
  if (!ctx.body) {
    ctx.body = {
      errors: [{ code: ERROR.HTTP_NOT_FOUND }],
      status: 404,
    };
  }
});

app.use(bodyParser());
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.use(serve(exportDir.name));
app.use(serve(path.resolve(__dirname, '../../client/dist')));

app.listen(3000, 'localhost', () => {
  console.log(`Listen to http://localhost:3000`);
  if (process.env.NODE_ENV !== 'development') {
    opn('http://localhost:3000');
  }
});
