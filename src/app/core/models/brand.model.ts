import { SeoMeta } from './seo.model';
export class Brand {
  id: string;
  name: string;
  description: string;
  slug: string;
  should_show_on_home: string;
  image: {
    id: string;
    name: string;
    real_name: string;
    s3_link: string;
  };
  seo: SeoMeta;
  cities: any[];
}
