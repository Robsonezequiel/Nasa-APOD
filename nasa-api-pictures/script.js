
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagescontainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray=[];
let favorite = {};

function showContent(page){
    window.scrollTo({ top: 0, behavior: 'instant'});
    if(page==='result'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page ==='result'? resultsArray : Object.values(favorite);
    currentArray.forEach((result)=>{
        // Card container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full image';
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt ='NASA Picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // Save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'result'){
            saveText.textContent = 'Add To Favorites ';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }else{
            saveText.textContent = 'Remove Favorites ';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }

        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // Copyright
        const copyrightResult = result.copyright === undefined? '': result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagescontainer.appendChild(card);
    });
}

function updateDOM(page){

    // Get favorites from local storage
    if(localStorage.getItem('nasaFavorites')){
        favorite = JSON.parse(localStorage.getItem('nasaFavorites'))
    
    }
    imagescontainer.textContent = '';
   createDOMNodes(page);
   showContent(page);
}

// Get images from nasa api

async function getNasaPictures(){
    // Show loader
    loader.classList.remove('hidden');
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        
        updateDOM('result');

    }
    catch(error){
        // catch error here
    }
}

// Add results to favorites
    function saveFavorite(itemUrl){
        // Loop trought results to select favorite
        resultsArray.forEach((item)=>{
            if(item.url.includes(itemUrl) && !favorite[itemUrl]){
                favorite[itemUrl] = item;
                // Show save confirmation for 2 seconds
                saveConfirmed.hidden = false;
                setTimeout(()=>{
                    saveConfirmed.hidden = true;
                },2000);

                // Set favorites in local storage
                localStorage.setItem('nasaFavorites',JSON.stringify(favorite));
            }
        });
    }

    // Remove favorite function

    function removeFavorite(itemUrl){
        if(favorite[itemUrl]){
            delete favorite[itemUrl];
            localStorage.setItem('nasaFavorites',JSON.stringify(favorite));
            updateDOM('favorite');
        }
    }

// On load

getNasaPictures();