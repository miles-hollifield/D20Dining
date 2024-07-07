function handleErrors( res ) {
    if(!res.ok) {
        let err = new Error(res.statusText);    
        err.status = res.status
        throw err;
    }

    return res;
}

function get(url) {
    return fetch(url, 
        {
            headers: {}
        }).then(handleErrors).then( res => {
            return res.json();
        }
        ).catch(err => {
            return err;
        });
}

function post(url, data) {
    console.log(JSON.stringify(data));
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(handleErrors).then(res => {
        return res.json();
      }).catch(err => {
        return err;
      });
}
function postFormData(url, data) {
    return fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(handleErrors).then(res => {
        return res.json();
      }).catch(err => {
        return err;
      });
}

export default {
    handleErrors, 
    get,
    post,
    postFormData
}