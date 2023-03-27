import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional } from '@angular/core';

@Injectable()
export class PageNotFoundService {
  constructor(
    @Optional()
    @Inject(RESPONSE)
    private response: any,
  ) {}

  public setStatus(code: number, message: string): void {
    if (this.response) {
      this.response.statusCode = code;
      this.response.statusMessage = message;
    }
  }
}
