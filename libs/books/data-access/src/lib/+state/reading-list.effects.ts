import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, first, map, mergeMap, tap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          mergeMap(() => [ 
            ReadingListActions.confirmedAddToReadingList({ book }),
            ReadingListActions.showUndoAddToReadingList({ book })
          ]),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          mergeMap(() => [
            ReadingListActions.confirmedRemoveFromReadingList({ item }),
            ReadingListActions.showUndoRemoveFromReadingList({ item })
          ]),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  showUndoAdd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.showUndoAddToReadingList),
      exhaustMap(({ book }) => {
        return this.snackbar.open(`${book.title} added to your reading list`, 'Undo', { duration: 2000 })
        .onAction()
        .pipe(
          map(_ => {
            return ReadingListActions.undoAddToReadingList({ book })
          })
        )
      })
    )
  );

  showUndoRemove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.showUndoRemoveFromReadingList),
      exhaustMap(({ item }) => {
        return this.snackbar.open(`${item.title} removed from your reading list`, 'Undo', { duration: 2000 })
        .onAction()
        .pipe(
          map(_ => {
            return ReadingListActions.undoRemoveFromReadingList({ item })
          })
        )
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private snackbar: MatSnackBar) {}
}
