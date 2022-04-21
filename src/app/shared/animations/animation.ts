import { animate, state, style, transition, trigger, animation, keyframes } from '@angular/animations';
import { VisibilityState } from '@core/enum/visibility-state.enum';

export const DEFAULT_TIMING = 1;

export const appAnimations = [
  trigger('scrollAnimation', [
    state(
      VisibilityState.Visible,
      style({
        transform: 'translateY(80px)',
      }),
    ),
    state(
      VisibilityState.Hidden,
      style({
        transform: 'translateY(0)',
      }),
    ),
    transition(`${VisibilityState.Visible} => ${VisibilityState.Hidden}`, animate('250ms')),
    transition(`${VisibilityState.Hidden} => ${VisibilityState.Visible}`, animate('250ms')),
  ]),
];

export const shake = animation(
  animate(
    '{{ timing }}s {{ delay }}s',
    keyframes([
      style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.1 }),
      style({ transform: 'translate3d(10px, 0, 0)', offset: 0.2 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.3 }),
      style({ transform: 'translate3d(10px, 0, 0)', offset: 0.4 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.5 }),
      style({ transform: 'translate3d(10px, 0, 0)', offset: 0.6 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.7 }),
      style({ transform: 'translate3d(10px, 0, 0)', offset: 0.8 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.9 }),
      style({ transform: 'translate3d(0, 0, 0)', offset: 1 }),
    ]),
  ),
  { params: { timing: DEFAULT_TIMING, delay: 0 } },
);
