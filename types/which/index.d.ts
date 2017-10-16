declare module 'which' {
  function which(command: string, cb: (err: Error, path: string) => void): void;
  function which(command: string, options: which.WhichOptions, cb: (err: Error, path: string) => void): void;

  namespace which {
    function sync(command: string, options?: WhichSyncOptions): string;

    interface WhichOptions {
      path?: string;
      pathExt?: string;
      all?: boolean;
    }

    interface WhichSyncOptions extends WhichOptions {
      nothrow?: boolean;
    }
  }

  export = which;
}
