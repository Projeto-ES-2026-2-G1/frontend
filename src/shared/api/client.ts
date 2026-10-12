import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { type Type } from 'arktype';
import { validateResponse } from './validate-response';

// eslint-disable-next-line import/no-named-as-default-member
export const apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Performs an Axios request and validates the resulting data against an ArkType schema.
 */
export async function requestValidated<T>(
  schema: Type<T>,
  config: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.request<unknown>(config);
  return validateResponse(schema, response.data);
}

/**
 * GET request with ArkType response validation.
 */
export async function getValidated<T>(
  url: string,
  schema: Type<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestValidated(schema, { ...config, url, method: 'GET' });
}

/**
 * POST request with ArkType response validation.
 */
export async function postValidated<T>(
  url: string,
  data: unknown,
  schema: Type<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestValidated(schema, { ...config, url, data, method: 'POST' });
}
