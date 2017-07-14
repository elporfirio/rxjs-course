import {Observable} from "rxjs";

let output = document.getElementById('output');

/** ERROR HANDLING **/

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

function loadWithFetch(url: string) {
    //funciona hasta que exista un subscribe
    return Observable.defer(() => {
        return Observable.fromPromise(fetch(`http://jsonplaceholder.typicode.com/${url}`)
            .then(result => {
                if(result.status === 200){
                    return result.json()
                } else {
                    return Promise.reject(result);
                }
            }));
    }).retryWhen(retryStrat({intentos: 3, delay: 2000}));
    // funciona sin subscribe por ser un fetch
    //return Observable.fromPromise(fetch(`http://jsonplaceholder.typicode.com/${url}`).then(result => result.json()));
}

function retryStrat({intentos = 4, delay = 1500}) {
    return function (errors) {
        return errors
            .scan((counter, val) => {
                console.warn(errors);
                console.log(counter, val);
                return counter + 1;
            }, 0)
            .takeWhile(counter => counter < intentos)
            .delay(delay);
    }
}

function renderPosts(posts) {
    posts.forEach(post => {
        let div = document.createElement('div');
        div.innerText = post.title;
        output.appendChild(div);
    })
}


loadWithFetch('postsx').subscribe(
    renderPosts,
    e => console.error("ERRORSAZO", e),
    () => console.log("COOOOOMMM PLETE")
);