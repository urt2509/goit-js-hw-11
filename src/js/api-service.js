import axios from 'axios';

export class AxiosApi {
  #BASE_URL = 'https://pixabay.com/api/?key=36152473-de2ee100f0f8118cd5cc29a36';

  async getImages(inputText, page, perPage) {
    const url = `${this.#BASE_URL}`;
    const resp = await axios.get(url, {
      params: {
        q: inputText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });
    return resp.data;
  }
}
