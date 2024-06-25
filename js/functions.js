

export function fetchJsonFile(urlToFetch, wrapFunction, errorFunction){
    fetch(urlToFetch)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            wrapFunction(data);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('There has been a problem with your fetch operation:', error);
            errorFunction();
            alert("There was a problem getting the Data.");
        });
    }



