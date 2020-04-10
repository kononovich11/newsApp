document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadNews();
  });

function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if(Math.floor(xhr.status / 100 ) !==2 ){
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return; 
          }
          const responseArr = JSON.parse(xhr.responseText);
          cb(null, responseArr);
        });
    
        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });
    
        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    posts(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if(Math.floor(xhr.status / 100 ) !==2 ){
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return; 
          }
          const responseArr = JSON.parse(xhr.responseText);
          cb(null, responseArr);
        });
    
        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if(headers) {
          Object.entries(headers).forEach(([key, value]) => {
            console.log(key, value);
          });
        }
    
        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
} 

const http = customHttp();

const newsServiece = (function() {
  const apiKey = '1811e67657934de8ae4c6a1d6cf0f290';
  const apiUrl = 'https://newsapi.org/v2';

  return {
    topHeadLines(country = 'us', category = 'general', cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  }
}());

//Elements 
const form = document.querySelector('form');
const countrySelect = form.elements['country'];
const categorySelect = form.elements['category'];
const searchInput = form.elements['autocomplete-input'];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
})

//Load news function
function loadNews() {
  const country = countrySelect.value;
  const category = categorySelect.value;
  const searchText = searchInput.value;

  showPreloader();

  if(!searchText) {
    newsServiece.topHeadLines(country, category, onGetResponse);
  } else {
    newsServiece.everything(searchText, onGetResponse);
  }
}

//function on get response from server 
function onGetResponse(err, responseArr) {
  removePreloader();
  if (err) {
    showAlert(err, 'err-msg');
    return;
  }

  //show empty message
  if(responseArr.articles == 0) {
    notFindRequest(`Sorry, we couldn't find any results` , 'btn');
    return;
  }

  renderNews(responseArr.articles);
}

//function render news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if(newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = '';
  news.forEach(newsItem => {
    //if article don't have picture
    if(!newsItem.urlToImage) {
      newsItem.urlToImage = 'https://i.ytimg.com/vi/qOKsRJbnD1A/maxresdefault.jpg';
    }
    const el = newsTemplate(newsItem);
    fragment += el;
  });
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

//function clear container
function clearContainer(container) {
  let child = container.lastElementChild;
  while(child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

//news item template function
function newsTemplate({urlToImage, title, url, description}) {
  return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}"/>
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div> 
  `;
}

function showAlert(msg, type = 'success') {
  M.toast({html: msg, classes: type});
}

function notFindRequest(msg, type){
  M.toast({html: msg, classes: type});
}

function showPreloader() {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  `); 
}

function removePreloader() {
  const loader = document.querySelector('.progress');
  if(loader) {
    loader.remove();
  }
}