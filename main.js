function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 16.91, lng: 98.99 },
      zoom: 6
  });
  
  fetchDataAndPlotOnMap(map);
}

function fetchDataAndPlotOnMap(map) {
  const dbRef = firebase.database().ref('tambons');
  
  dbRef.once('value').then((snapshot) => {
      const data = snapshot.val();
      plotDataOnMap(map, data);
  }).catch((error) => {
      console.error("Error fetching data: ", error);
  });
}

function plotDataOnMap(map, data) {
  for (let key in data) {
      if (data.hasOwnProperty(key)) {
          const item = data[key];
          const latLng = new google.maps.LatLng(item.lat, item.lng);
          const population = item.population;
          let color;

          if (population === 0) {
              color = 'green';
          } else if (population <= 50) {
              color = 'yellow';
          } else if (population <= 200) {
              color = 'orange';
          } else if (population <= 500) {
              color = 'red';
          } else {
              color = 'darkred';
          }

          const circle = new google.maps.Circle({
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.35,
              map: map,
              center: latLng,
              radius: Math.sqrt(population) * 100
          });

          circle.addListener('click', () => {
              new google.maps.InfoWindow({
                  content: `<p>${item.tambon}<br>Population: ${population}</p>`
              }).open(map, circle);
          });
      }
  }
}

