export type levelType = "INFO" | "DEBUG" | "WARN" | "ERROR" | "FATAL" | "REQUEST" | "RESPONSE" | "SECURITY" | "AUDIT" | "PERFORMANCE" | "SYSTEM";
export type errorType = "STATCODEERROR" | "SYNTAXERROR" | "TYPEERROR" | "SERVERERROR" | "MAILERROR" | "VERIFYERROR" | "AUTHERROR" | "ANYERROR" | "TOKENERROR" | undefined;

export type loggerType = {
  requestID?: string,
  timestamp?: Date,
  level: levelType,
  logType: string,
  message: string,
  service: string,
  userID?: string,
  token?: string,
  username?: string,
  ip?: string,
  endpoint?: string,
  method?: string,
  userAgent?: string,
  statusCode?: number,
  durationMs?: any | undefined,
  details?: {
    error?: errorType,
    stack?: string
  }
};