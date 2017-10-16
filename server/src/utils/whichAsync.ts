import * as which from 'which';

async function whichAsync(command: string, options?: which.WhichOptions): Promise<string | null> {
  const promise: Promise<string> = new Promise((resolve, reject) => {
    const cb = (err: Error | null, path: string) => {
      if (err) {
        return reject(err);
      }
      return resolve(path);
    };
    !options ? which(command, cb) : which(command, options, cb);
  });
  return promise.catch(() => null);
}
export default whichAsync;
