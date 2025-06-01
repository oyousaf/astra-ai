export type Job = {
  id: number;
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  notes?: string;
};

export type ApiError = {
  response?: {
    data?: {
      error?: string;
    };
  };
};