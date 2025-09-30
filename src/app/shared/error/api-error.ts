export interface ApiError {
  status: number;
  timestamp: string;
  message?: string;
  debugMessage?: string;
}
