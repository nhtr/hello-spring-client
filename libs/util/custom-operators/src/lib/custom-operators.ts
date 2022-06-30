import {Observable} from 'rxjs';
import {filter, switchMapTo, take} from 'rxjs/operators';

export function takeAfterLoggedIn<T>(token$: Observable<string>): (source$: Observable<T>) => Observable<T> {
  return source$ => token$.pipe(
    filter((token) => !!token),
    take(1),
    switchMapTo(source$)
  );
}
