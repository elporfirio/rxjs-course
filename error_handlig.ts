import {Observable} from "rxjs";

let source = Observable.merge(
    Observable.of(1),
    Observable.from([2,3,4]),
    Observable.throw(new Error('Murio x_X!')),
    Observable.of(5)
).catch(e => {
    console.log(`Error Maton ${e}`);
    return Observable.of(10);
});

source.subscribe(
    value => console.log(`value: ${value}`),
    error => console.error(`error: ${error}`),
    () => console.log('complete')
);