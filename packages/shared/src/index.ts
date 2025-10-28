export interface Duty {
  id: string;
  name: string;
}

export interface GetDutiesResponse {
  duties: Duty[];
  totalCount: number;
}
