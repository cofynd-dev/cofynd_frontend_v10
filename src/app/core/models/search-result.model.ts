import { WorkSpace } from '@core/models/workspace.model';
export class SearchResult {
  data: WorkSpace[] = [];
  locations: GoogleSearchResult = new GoogleSearchResult();
}

export class GoogleSearchResult {
  address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  placeId: string;
  name: string;
}
