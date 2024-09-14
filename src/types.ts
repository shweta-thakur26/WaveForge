export interface ApiResponse {
  message: string;
  data: any;
}

interface AxiosError {
  response?: {
    status: number;
    data: any;
  };
  config?: any;
  message?: string;
}
