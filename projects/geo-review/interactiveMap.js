export default class InteractiveMap {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }

  async init() {
    await this.injectYMapsScript();
    await this.loadYMaps();
    this.initMap();
  }

  injectYMapsScript() {
    return new Promise((resolve) => {
      const ymapsScript = document.createElement('script');
      ymapsScript.src =
        'https://api-maps.yandex.ru/2.1/?apikey=ac0cbb90-6a9d-4644-8129-ce1dc79e32dd&lang=ru_RU';
      document.body.appendChild(ymapsScript);
      ymapsScript.addEventListener('load', resolve);
    });
  }

  /*loadYMaps() {
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    initMap(){
        this.map = new ymaps.Map(this.mapId, {
            center: [55.755660, 37.532723],
            zoom: 9.4
        });

        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false
        });

        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords)
        });

        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.geoObjects.add(this.clusterer);
    }*/

  openBalloon(coords, content) {
    this.map.balloon.open(coords, content);
  }

  setBalloonContent(content) {
    this.map.balloon.setData(content);
  }

  closeBalloon() {
    this.map.balloon.close();
  }
}
