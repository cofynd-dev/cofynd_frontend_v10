import { GoogleSearchResult } from './search-result.model';
export declare class ApiResponse<T> {
  type: string;
  code: number;
  message: string;
  token?: string;
  totalRecords?: number;
  data: T | null;
  locations?: GoogleSearchResult[];
}
