export interface Resume {
  id: string;
  filename?: string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: string;
  };
}
