import { apiClient, ApiClientOptions } from "./apiClient";
import type { Duty, GetDutiesResponse } from "shared";

const DUTIES_ENDPOINT = "/duties";

export interface GetDutiesParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: string;
}

export const getDuties = (
  params: GetDutiesParams,
): Promise<GetDutiesResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", params.page.toString());
  queryParams.set("limit", params.limit.toString());
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.order) queryParams.set("order", params.order);

  const options: ApiClientOptions = {
    useCache: false,
  };

  return apiClient<GetDutiesResponse>(
    `${DUTIES_ENDPOINT}?${queryParams}`,
    options,
  );
};

export const createDuty = (name: string): Promise<Duty> => {
  return apiClient<Duty>(DUTIES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const updateDuty = (id: string, name: string): Promise<Duty> => {
  return apiClient<Duty>(`${DUTIES_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
};

export const deleteDuty = (id: string): Promise<null> => {
  return apiClient<null>(`${DUTIES_ENDPOINT}/${id}`, { method: "DELETE" });
};
