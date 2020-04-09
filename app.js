document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
  });

function http() {
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

const Http = http();
console.log(myHttp);