import './sass/main.scss';
import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";


const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input[name=searchQuery]'),
    button: document.querySelector('button'),
    div: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  
}

let counter = 1;

const KEY = '25323007-3d609b483f4fcb74c4bf2a361';
const BASIC_URL = 'https://pixabay.com/api/';
const SEARCH = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=5';


refs.form.addEventListener('submit', renderEvent);
refs.loadMoreBtn.addEventListener('click', loadMoreEvent);

async function renderEvent(event) {
  event.preventDefault()
  refs.div.innerHTML = '';
  await axios.get(`${BASIC_URL}?key=${KEY}&q=${refs.input.value}&${SEARCH}&page=${counter}`)
    .then(data => {
      if (data.data.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`)
      createRender(data.data.hits)
      btnDisable()
    })
  
}

function createRender(gallery) {
  const createGallery = gallery.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
  {
    return `<div class="photo-card">
    <a href="${largeImageURL}">
  <img width=400 height=400 src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes${likes}</b>
    </p>
    <p class="info-item">
      <b>Views${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
</div>`
  }
  )
  refs.div.insertAdjacentHTML('beforeend', createGallery.join(''))
}

async function loadMoreEvent() {
  counter += 1
  await axios.get(`${BASIC_URL}?key=${KEY}&q=${refs.input.value}&${SEARCH}&page=${counter}`)
        .then(data => {
      if (data.data.hits.length === 0) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`)
    createRender(data.data.hits)
    })
}

function btnDisable() {
  refs.loadMoreBtn.classList.remove('hiddenBtn')
  refs.loadMoreBtn.disabled = true;
}


function btnEnable() {
  refs.loadMoreBtn.disabled = false;
}