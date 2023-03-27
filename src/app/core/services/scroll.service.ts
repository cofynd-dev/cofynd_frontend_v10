import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { interval, Observable, Subject } from 'rxjs';
import { filter, map, pairwise, throttle } from 'rxjs/operators';

interface Position {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private currentScrollPercent = 80;
  private scrollSubject: Subject<Document> = new Subject();

  constructor(private eventManager: EventManager) {
    this.eventManager.addGlobalEventListener('window', 'scroll', this.onScroll.bind(this));
  }

  private onScroll = (event: UIEvent) => this.scrollSubject.next(event.target as Document);

  private isUserScrollingDown = (positions: Array<Position>) => positions[0].scrollTop < positions[1].scrollTop;

  private isScrollExpectedPercent = (position: Position, percent: number) =>
    (position.scrollTop + position.clientHeight) / position.scrollHeight > percent / 100;

  get scrollPercent(): number {
    return this.currentScrollPercent;
  }

  set scrollPercent(scrollPercent: number) {
    this.currentScrollPercent = scrollPercent;
  }

  get onScroll$(): Observable<Document> {
    return this.scrollSubject.asObservable();
  }

  get onScrolledDown$(): Observable<[Position, Position]> {
    return this.onScroll$
      .pipe(throttle(() => interval(500)))
      .pipe(
        map(doc => {
          return {
            scrollHeight: doc.documentElement.scrollHeight,
            scrollTop: doc.documentElement.scrollTop || doc.body.scrollTop,
            clientHeight: doc.documentElement.clientHeight,
          };
        }),
      )
      .pipe(pairwise())
      .pipe(
        filter(
          positions =>
            this.isUserScrollingDown(positions) &&
            this.isScrollExpectedPercent(positions[1], this.currentScrollPercent),
        ),
      );
  }
}
