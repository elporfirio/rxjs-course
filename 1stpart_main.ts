// import {Observable, Observer} from "rxjs"; //IMPORTA TOOOODO
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/map"
import "rxjs/add/operator/filter"

let numbers = [1,2,3,4,5,6];

let source = Observable.from(numbers);

/** Modo Clase **/
class MyObserver implements Observer<number>{
    next(value){
        console.info(value);
    }

    error(e){
        console.error('error' + e);
    }

    complete(){
        console.log('complete');
    }
}

//source.subscribe(new MyObserver());
/** Modo Compacto **/
source.subscribe(
    value => console.log(value),
    e => console.error('error' + e),
    () => console.log('complete')
);


/** asdasd */

let source2 = Observable.create(observer => {
    for(let n of numbers){
        /** obverser.error es como tirar una exepción **/
        // if(n %2 === 0) {
        //     observer.error('Fallo algo');
        // }
        observer.next(n);
    }
    observer.complete();
});

source2.subscribe(
    value => console.log(value),
    e => console.error('error' + e),
    () => console.log('complete')
);

/** Con DELAY **/
console.log('Observables con Delay');

let source3 = Observable.create(observer => {
    let index = 0;
    let productValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length){
            setTimeout(productValue, 2000)
        } else {
            observer.complete();
        }
    };
    productValue();
});

source3.subscribe(
    value => console.log(value),
    e => console.error('error' + e),
    () => console.log('complete')
);


/** Observables con Operador MAP **/
console.log('Observables con Operador MAP');

let source4 = Observable.create(observer => {
    for(let n of numbers){
        /** obverser.error es como tirar una exepción **/
        observer.next(n);
    }
    observer.complete();
}).map(n => n * 5)
    .filter(n => n % 2 > 0);

source4.subscribe(
    value => console.log(value),
    e => console.error('error' + e),
    () => console.log('complete')
);
