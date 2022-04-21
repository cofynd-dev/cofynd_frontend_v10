export interface SeoSocialShareData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  footer_title?: string;
  footer_description?: string;
  script?: string;
}

export enum SeoMetaTagAttr {
  name = 'name',
  property = 'property',
}

export interface SeoMetaTag {
  attr: SeoMetaTagAttr;
  attrValue: string;
  value?: string;
}

export interface SeoMeta {
  description: string;
  status: boolean;
  title: string;
  footer_title?: string;
  footer_description?: string;
  keywords?: string;
  page_title?: string;
  script?: string;
}
