interface Observable {
  subscribe: (handle?: {
    next?: (res: any) => void;
    error?: (err: any) => void;
    complete?: (res: any) => void;
  }) => void;
}

declare module 'qiniu-js' {
  const upload: (
    file: File,
    key: string,
    token: string,
    putExtra?: object,
    config?: object
  ) => Observable;
}
