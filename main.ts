import {Observable} from "rxjs";

let output = document.getElementById('output');

/** ERROR HANDLING **/

let source = Observable.merge(
    Observable.of(1),
    Observable.from([2, 3, 4]),
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
                if (result.status === 200) {
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
                /** Para este activar el TakeWhile **/
                // console.warn(errors);
                // console.log(counter, val);
                // return counter + 1;

                /** alternative sin el TakeWhile **/
                counter += 1;
                if (counter < intentos) {
                    return counter;
                } else {
                    throw new Error(val);
                }
            }, 0)
            // .takeWhile(counter => counter < intentos)
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


/** UNSUBSCRIBE **/
function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        let onLoad = () =>  {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        };

        xhr.addEventListener('load', onLoad);

        xhr.open('GET', `http://jsonplaceholder.typicode.com/${url}`);
        xhr.send();

        // Unsubcribe Logic
        return () => {
            xhr.removeEventListener('load', onLoad);
            xhr.abort();
        }
    }).retryWhen(retryStrat({intentos: 3, delay: 1000})) //esto es el error
}



let subscription = load('postsx')
    .subscribe(renderPosts,
            e => console.log(`error: ${e}`),
        () => console.log('complete'));

subscription.unsubscribe();