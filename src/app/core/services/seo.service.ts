import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ApiResponse } from '@core/models/api-response.model';
import { SeoMeta, SeoMetaTag, SeoSocialShareData } from '@core/models/seo.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private readonly metaService: Meta,
    private http: HttpClient,
    private readonly titleService: Title,
    @Inject(DOCUMENT) private readonly document,
  ) {}

  getMeta(url?: string) {
    return this.http.get<ApiResponse<SeoMeta>>(`/user/seo/${url}`).pipe(
      map(seoData => {
        return seoData.data;
      }),
    );
  }

  setData(data: SeoSocialShareData): void {
    this.setTitle(data.title);
    this.setType(data.type);
    this.setDescription(data.description);
    this.setImage(data.image);
    this.setUrl(data.url);
    this.setKeywords(data.keywords);
  }

  setKeywords(keywords: string) {
    if (keywords && keywords.length) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    } else {
      this.metaService.removeTag(`name='keywords'`);
    }
  }

  setTitle(title: string = '') {
    this.titleService.setTitle(title);
    if (title && title.length) {
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:image:alt', content: title });
      this.metaService.updateTag({ property: 'og:image:alt', content: title });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ name: 'title', content: title });
    } else {
      this.metaService.removeTag(`name='twitter:title'`);
      this.metaService.removeTag(`name='twitter:image:alt'`);
      this.metaService.removeTag(`property='og:image:alt'`);
      this.metaService.removeTag(`property='og:title'`);
      this.metaService.removeTag(`name='title'`);
    }
  }

  setType(type?: string) {
    if (type && type.length) {
      this.metaService.updateTag({ property: 'og:type', content: type });
    } else {
      this.metaService.removeTag(`property='og:type'`);
    }
  }

  setDescription(description?: string) {
    if (description && description.length) {
      this.metaService.updateTag({ name: 'twitter:description', content: description });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ name: 'description', content: description });
    } else {
      this.metaService.removeTag(`name='twitter:description'`);
      this.metaService.removeTag(`property='og:description'`);
      this.metaService.removeTag(`name='description'`);
    }
  }

  setImage(image?: string) {
    if (image && image.length) {
      this.metaService.updateTag({ name: 'twitter:image', content: image });
      this.metaService.updateTag({ property: 'og:image', content: image });
      this.metaService.updateTag({ property: 'og:image:height', content: '630' });
    } else {
      this.metaService.removeTag(`name='twitter:image'`);
      this.metaService.removeTag(`property='og:image'`);
      this.metaService.removeTag(`property='og:image:height'`);
    }
  }

  setMetaTag(metaTag: SeoMetaTag): void {
    if (Boolean(metaTag.value)) {
      const metaTagObject = {
        [metaTag.attr]: metaTag.attrValue,
        content: metaTag.value,
      };
      this.metaService.updateTag(metaTagObject);
    } else {
      const selector = `${metaTag.attr}='${metaTag.attrValue}'`;
      this.metaService.removeTag(selector);
    }
  }

  setUrl(url?: string) {
    if (url && url.length) {
      this.metaService.updateTag({ property: 'og:url', content: url });
    } else {
      this.metaService.removeTag(`property='og:url'`);
    }
    this.setCanonicalUrl(url);
  }

  setCanonicalUrl(url?: string) {
    // first remove potential previous url
    const selector = `link[rel='canonical']`;
    const canonicalElement = this.document.head.querySelector(selector);
    if (canonicalElement) {
      this.document.head.removeChild(canonicalElement);
    }

    if (url && url.length) {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }

  addNoFollowTag() {
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  removeNoFollowTag() {
    this.metaService.removeTag('name="robots"');
  }

  setPrevRelationUrl(url?: string) {
    // first remove potential previous url
    const selector = `link[rel='prev']`;
    const canonicalElement = this.document.head.querySelector(selector);
    if (canonicalElement) {
      this.document.head.removeChild(canonicalElement);
    }

    if (url && url.length) {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'prev');
      this.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }

  setNextRelationUrl(url?: string) {
    // first remove potential next url
    const selector = `link[rel='next']`;
    const canonicalElement = this.document.head.querySelector(selector);
    if (canonicalElement) {
      this.document.head.removeChild(canonicalElement);
    }

    if (url && url.length) {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'next');
      this.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }
}
