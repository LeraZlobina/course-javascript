import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  onInit() {
    const coords = JSON.parse(localStorage.getItem('review'));

    if (coords) {
      for (const item of coords) {
        this.map.createPlacemark(item.coords);
      }
    }

    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }

  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    if (reviews) {
      for (const item of reviews) {
        const div = document.createElement('div');
        div.classList.add('review-item');
        div.innerHTML = `
                            <div>
                                <b>${item.name}</b> [${item.place}]
                            </div>
                            <div>${item.text}</div>
                            `;
        reviewList.appendChild(div);
      }
    }

    return root;
  }

  onClick(coords) {
    this.map.openBalloon(coords, '');
    const list = JSON.parse(localStorage.getItem('review'));
    let filteredList = undefined;
    if (list) {
      filteredList = list.filter(
        (item) => JSON.stringify(item.coords) === JSON.stringify(coords)
      );
      filteredList = filteredList.map((item) => item.review);
    }
    const form = this.createForm(coords, filteredList);
    this.map.openBalloon(coords, form.innerHTML);
  }

  onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);
      const data = {
        coords,
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value,
        },
      };

      try {
        const savedReviews = JSON.parse(localStorage.getItem('review'));
        if (!savedReviews) {
          const dataArray = [data];
          localStorage.setItem('review', JSON.stringify(dataArray));
        } else {
          const newStorage = [...savedReviews, data];
          localStorage.setItem('review', JSON.stringify(newStorage));
        }
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      } catch (e) {
        const formError = document.querySelector('.form-error');
        formError.innerText = e.message;
      }
    }
  }
}
