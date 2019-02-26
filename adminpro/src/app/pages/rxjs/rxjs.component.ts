import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {map, filter} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
      // .pipe(retry(2))
      .subscribe(numero => console.log('Subs: ', numero),
        error => console.error('Error en el obs', error),
        () => console.log('El observador terminó!'));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable(observer => {

      let contador = 0;
      const intervalo = setInterval(() => {

        contador++;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        //
        // if (contador === 2) {
        //   clearInterval(intervalo);
        //   observer.error('Auxilio');
        // }

      }, 1000);
    }).pipe(
      map((resp: {valor: number}) => resp.valor),
      filter((valor, index) => {
        if ((valor % 2) === 1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
