import {Observable} from 'rxjs'; //IMPORTA TOOOODO

// Crear Observable desde un evento
let circle = document.getElementById('circle');
let output = document.getElementById('output');
let button = document.getElementById('button');
let buttonFetch = document.getElementById('buttonFetch');

let source = Observable.fromEvent(document, 'mousemove')
    .map((e: MouseEvent) => { //Filtrar los eventos
        return {
            x: e.clientX,
            y: e.clientY
        }
    })
    .filter(value => value.x < 500)
    .delay(100); //Lo aplica despues del map

let btnSource = Observable.fromEvent(button, 'click');
let btnFetchSource = Observable.fromEvent(buttonFetch, 'click');


function onNext(val) {
    //console.log(val);
    circle.style.left = val.x + 'px';
    circle.style.top = val.y + 'px';
}

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open('GET', `http://jsonplaceholder.typicode.com/${url}`);
        xhr.send();
    }).retryWhen(retryStartegy({intentos: 3, delay: 1000})) //esto es el error
}

function loadWithFetch(url: string) {
    //funciona hasta que exista un subscribe
    return Observable.defer(() => {
        return Observable.fromPromise(fetch(`http://jsonplaceholder.typicode.com/${url}`).then(result => result.json()));
    });
    // funciona sin subscribe por ser un fetch
    //return Observable.fromPromise(fetch(`http://jsonplaceholder.typicode.com/${url}`).then(result => result.json()));
}

function retryStartegy({intentos = 4, delay = 1500}) {
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


/** Modo Compacto **/
source.subscribe(
    onNext,
    e => console.error('error' + e),
    () => console.log('complete')
);


btnSource
    .flatMap(e => load('postss'))
    .subscribe(
        renderPosts,
        e => console.error('error' + e),
        () => console.log('complete')
    );

btnFetchSource
    .flatMap(e => loadWithFetch('posts'))
    .subscribe(
        renderPosts,
        e => console.error('error' + e),
        () => console.log('complete')
    );