import { GoogleSearchResult } from './search-result.model';
export class ResponseModel<T> {
  message: string;
  totalRecords: number;
}
export declare class ApiResponse<T> {
  type: string;
  code: number;
  message: string;
  token?: string;
  totalRecords?: number;
  data: T | null;
  locations?: GoogleSearchResult[];
}
export class ObjectResponseModel<T> extends ResponseModel<T> {
  data: T = {} as T;
  constructor() {
    super();
  }
}
