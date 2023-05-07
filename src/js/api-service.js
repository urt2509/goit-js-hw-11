const URL = 'https://pixabay.com/api/';
const KEY = '36152473-de2ee100f0f8118cd5cc29a36';

export default function fetchImages(
  input,
  imgType,
  orientationType,
  safeSearch
) {
  fetch(
    `${URL} ? ${KEY}&q=${input}&image_type=${imgType}&orientation=${orientationType}&safesearch=${safeSearch}`
  )
    .then(resp => resp.json())
    .catch(err => console.log(err));
}
