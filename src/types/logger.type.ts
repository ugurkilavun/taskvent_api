export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

type HttpHeaders = {
  contentType?: string;
  userAgent?: string;
  accept?: string;
  acceptEncoding?: string;
  connection?: string;
  contentLength?: string; // Number
  host?: string;
};

type RequestInfo = {
  method?: string;
  url?: string;
  // path?: string;
  // query?: Record<string, any>;
  // params?: Record<string, any>;
  // body?: any;
  ip?: string;
  httpVersion: string;
  headers?: HttpHeaders;

};

type ResponseInfo = {
  statusCode?: number;
  durationMs?: number;
  headers?: HttpHeaders;
  // body?: any;
};

type UserInfo = {
  id?: string;
  token?: string;
  email?: string;
};

export type ErrorInfo = {
  name?: string;
  message: string;
  stack?: string;
  // code?: string | number; // Application-specific error code
};

export type LoggerType = {
  logID?: string;
  timestamp: Date | string;
  level: LogLevel;
  // service: string;
  environment?: string;
  // hostname?: string;
  client?: string;

  message: string;

  // Request and response details
  request?: RequestInfo;
  response?: ResponseInfo;

  // User informations
  user?: UserInfo;

  // Error condition
  error?: ErrorInfo;
};