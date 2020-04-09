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
  const apiUrl = 'http://newsapi.org/v2';

  return {
    topHeadLines(country = 'us', cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  }
}());

//Load news function
function loadNews() {
  newsServiece.topHeadLines('us', onGetResponse);
}

//function on get response from server 
function onGetResponse(err, responseArr) {
  renderNews(responseArr.articles);
}

//function render news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  let fragment = '';
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
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