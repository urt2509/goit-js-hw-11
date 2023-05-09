import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import { AxiosApi } from './js/api-service';

const searchForm = document.querySelector('.search-form');
const input = document.querySelector('[name]');
const card = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load__more');

const axiosApi = new AxiosApi();

let inputText = '';
let page = 1;
let perPage = 40;

let lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  page = 1;

  const inputText = e.currentTarget.elements.searchQuery.value.trim();

  if (!inputText) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    clearRender();
    searchForm.reset();

    return;
  }
  btnLoadMore.style.display = 'none';

  try {
    const response = await createRequest(inputText);

    clearRender();

    createCard(response.hits);

    btnLoadMore.style.display = 'inline-block';

    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    if (response.hits.length < 40) {
      btnLoadMore.style.display = 'none';
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  btnLoadMore.addEventListener('click', onClick);
}

function createCard(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo__card">
      <a href="${largeImageURL}" class="photo__link">
      <img class="photo__item" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
        <p class="info__box">
            <b class="info__text">Likes</b>
            <span class="info__item">${likes}</span>
        </p>
        <p class="info__box">
            <b class="info__text">Views</b>
            <span class="info__item">${views}</span>
        </p>
        <p class="info__box">
            <b class="info__text">Comments</b>
            <span class="info__item">${comments}</span>
        </p>
        <p class="info__box">
            <b class="info__text">Downloads</b>
            <span class="info__item">${downloads}</span>
        </p>
    </div>
    </a>
</div>`;
      }
    )
    .join('');

  card.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearRender() {
  card.innerHTML = '';
}

async function createRequest(inputText) {
  try {
    const response = await axiosApi.getImages(inputText, page, perPage);

    return response;
  } catch (error) {
    console.log(error);
  }
}

async function onClick(e) {
  page += 1;

  try {
    const response = await axiosApi.getImages(inputText, page, perPage);

    if (!response.hits.length) {
      btnLoadMore.style.display = 'none';
      throw new Error();
    }

    createCard(response.hits);
  } catch (error) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
