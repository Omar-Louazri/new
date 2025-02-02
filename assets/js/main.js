// custom varibles :
let canvas = document.getElementById('content');
let nav = document.getElementById('nav-list');
let url = 'https://gist.githubusercontent.com/Omar-Louazri/dc32933b68bef3990a65b7a0f31675a6/raw/5ded72657ec780fbc74882c056043844a8cb57ca/lasse9JSON';
function throw_error(error) {
    console.error(error);
    canvas.style.display = 'flex';
    canvas.style.justifyContent = 'center';
    canvas.style.alignItems = 'center';
    canvas.style.height = '90vh';
    canvas.innerHTML = `
        <div class="alert alert-danger w-100 text-center    " role="alert">
            ${error}
        </div>
    `;

}
function throw_filliers_page(filliers) {
    canvas.style.display = 'flex';
    canvas.style.justifyContent = 'center';
    canvas.style.alignItems = 'center';
    canvas.style.flexWrap = 'wrap';
    canvas.style.marginTop = '100px';
    canvas.style.gap = '2em';
    
    canvas.innerHTML = '';
    for (let i = 0; i < filliers.length; i++) {
        let fillier = filliers[i];
        let fillier_html = `
            <div class="card" style="width: 500px;">
                  <div class="card-body">
                          <a href="#" class="btn btn-primary d-block fillier_class_listener">${fillier.name}</a>
                    </div>  
            </div>
        `;
        canvas.innerHTML += fillier_html;
    }
    let fillier_class_listener = document.querySelectorAll('.fillier_class_listener');
    console.log(fillier_class_listener);
    
    for (let k = 0; k < fillier_class_listener.length; k++) {
        fillier_class_listener[k].addEventListener('click', (e) => {
            
            let fillier_name = e.target.innerHTML.trim();
            let fillier = get_fillier(filliers, fillier_name);

            throw_video_page(fillier);

        
        });
    }
}
function throw_video_page(fillier) {
    canvas.style.display = 'block';

    canvas.style.marginTop = '30px';
    canvas.style.gap = '2em';

    let html = `
        <h1 class="text-center">Filliere choisi : ${fillier.name}</h1>
        <br><br>
        <main class="d-flex justify-content-center flex-wrap w-100">
    `;

    for (let i = 0; i < fillier.session.length; i++) {
        let session = fillier.session[i];
        html += `
            <div class="card" style="width: 500px;">
                <div class="card-body">
                    <a href="#" class="btn btn-primary d-block session_class_listener">${session.name}</a>
                </div>  
            </div>
        `;
    }

    html += `
        </main>
        <section id="main-content"></section>
    `;

    // Update the canvas content only once
    canvas.innerHTML = html;

   track_session_listener(fillier);
}
function track_session_listener(fillier) {  
    let canvas2 = document.getElementById('main-content');
    let session_class_listener = document.querySelectorAll('.session_class_listener');
    for (let i = 0; i < session_class_listener.length; i++) {
        session_class_listener[i].addEventListener('click', (e) => {
            console.log("clickeeeed");
            canvas2.innerHTML = '';
            afficher_session(fillier.session[i].element_module);
        });
    }
}
function afficher_session(session) {

    let canvas2 = document.getElementById('main-content');
 // VARIABLE GLOB : fillier.session[i].element_module
    for (let i = 0; i < session.length; i++) {
        showElementByElement(session[i], canvas2);

    }

}
function getYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/)?([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function showElementByElement(element, old_canvas) {
    let element_name = element.name;
    let header = `
    <div class="container">
        <h1 class="text-center">${element_name}</h1>
    </div>  
    `;

    old_canvas.innerHTML += header;
    old_canvas.innerHTML += `
    <div class="d-flex justify-content-center flex-wrap" style="width: 100%;">
    `;
    // now append videos
    let videos = element.videos;
    for (let i = 0; i < videos.length; i++) {
        let video = videos[i];
        let video_html = `
            <div class="card" style="width: 500px;">
                <img src="https://img.youtube.com/vi/${getYouTubeID(video.url)}/hqdefault.jpg" alt="${video.name}" style="width: 100%; height: auto;">
                <div class="card-body">
                    <h5 class="card-title">${element_name} - ${video.name}</h5>
                    <a href="${video.url}" target="_blank" class="btn btn-primary">Regarder sur YouTube</a>
                </div>  
            </div>
        `;
        
        old_canvas.innerHTML += video_html;
    }
    old_canvas.innerHTML += `

    </div>
    `;
}
function get_cate(data, category_name) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].name == category_name) {    
            return data[i];
        }   
    }
    console.log('Category not found');
    return null;
    
}
function get_fillier(data, fillier_name) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].name == fillier_name) {
            return data[i];
        }
    }
    console.log('Fillier not found');
    return null;
    
}
function return_categories_holder(data_holder, category_name) {
    let data = get_cate(data_holder, category_name);
    throw_filliers_page(data.filliers);
    
}

const xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.onload = function () {
  if (xhr.status === 200) {
    const data_holder = JSON.parse(xhr.responseText);
    let data = data_holder.categories;
    let T = [];
    for (let i = 0; i < data.length; i++) {
        let category_name = data[i].name;
        T.push(category_name);
        let cate = `
            <li class="nav-item">
                <a class="nav-link categorie_class_listener" href="#" aria-current="page">${category_name}</a>
            </li>
        `;
        nav.innerHTML += cate;

    }
    let categorie_class_listener = document.querySelectorAll('.categorie_class_listener');

    for (let i = 0; i < categorie_class_listener.length; i++) {
        categorie_class_listener[i].addEventListener('click', (e) => {
            //let category_name = e.name;
            let category_name = e.target.innerHTML.trim();
            if (T.includes(category_name)) {
                return_categories_holder(data, category_name);
            } else {
                throw_error('Category not found');
            }
        });
    }
    
  } else {
    console.error(`Error: ${xhr.status}`);
  }
};
xhr.send();