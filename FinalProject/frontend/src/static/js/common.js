import api from './apiClient.js'
const logoutButton = document.querySelector('#logoutButton');
const clearData = document.querySelector('#clear-data');

if(logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        console.log("here");
        api.logout().then( () => {
            document.location = './';
        })
    })
}

if(clearData) {
    clearData.addEventListener('click', (e) => {
    
    })
} 

/*********************\
* SERVICE WORKER CODE *
\*********************/

function registerServiceWorker() {
    if (!navigator.serviceWorker) { // Are SWs supported?
      return;
    }
  
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        /*if (!navigator.serviceWorker.controller) {
          //Our page is not yet controlled by anything. It's our first SW
          return;
        }*/
  
        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed, but waiting');
        //   newServiceWorkerReady(registration.waiting);
        } else if (registration.active) {
          console.log('Service worker active');
        }
  
        registration.addEventListener('updatefound', () => { //This is fired whenever registration.installing gets a new worker
          
          console.log("SW update found", registration, navigator.serviceWorker.controller);
          newServiceWorkerReady(registration.installing);
        });
      })
      .catch(error => {
        console.error(`Registration failed with error: ${error}`);
      });
  
    navigator.serviceWorker.addEventListener('message', event => {
      console.log('SW message', event.data);
    });
  
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload" in dev tools.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if(refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  
  };
  
  registerServiceWorker();
  
  
  //This method is used to notify the user of a new version
  function newServiceWorkerReady(worker) {// Create the outermost container (the card)
    const card = document.createElement('div');
    card.className = 'centered-card updateAvailable';

  
    // Create the header
    const header = document.createElement('div');
    header.className = 'card-header';
  
    const title = document.createElement('h5');
    title.className = 'modal-title';
    title.textContent = 'Update Available';
  
    header.appendChild(title);
  
    // Create the body
    const body = document.createElement('div');
    body.className = 'card-body';
  
    const bodyText = document.createElement('p');
    bodyText.textContent = 'A new version of D20Dining is available, click update below to get the new update!';
    body.appendChild(bodyText);
  
    // Create the footer
    const footer = document.createElement('div');
    footer.className = 'card-footer';
  
    const closeFooterButton = document.createElement('button');
    closeFooterButton.className = 'swButton btn btn-warning';
    closeFooterButton.textContent = 'Close';
    closeFooterButton.onclick = () => card.style.display = 'none';
  
    const updateButton = document.createElement('button');
    updateButton.className = 'swButton btn btn-warning';
    updateButton.textContent = 'Update Page';
    updateButton.onclick = () => worker.postMessage({action: 'skipWaiting'});
  
    footer.appendChild(closeFooterButton);
    footer.appendChild(updateButton);
  
    // Assemble the card
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    // Append the card to the body or any other desired element
    document.body.appendChild(card);
  }

  function removeUpdateCard() {
    const card = document.querySelector('.centered-card');
    if (card) {
      card.style.display = 'hidden';
    }
  }
  