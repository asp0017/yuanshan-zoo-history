let map;
let imageOverlay;
let markers = [];

const imageBounds = [
  [0, 0],
  [900, 1200]
];

function initMap() {
  map = L.map("imageMap", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 2,
    zoomControl: true
  });

  map.fitBounds(imageBounds);
  updateEra("era1914");
  map.on("click", function (e) {
  console.log("coord:", [Math.round(e.latlng.lat), Math.round(e.latlng.lng)]);
});
}

function clearMap() {
  if (imageOverlay) {
    map.removeLayer(imageOverlay);
  }

  markers.forEach(marker => {
    map.removeLayer(marker);
  });

  markers = [];
}

function updateEra(eraKey) {
  const era = window.eraData[eraKey];

  clearMap();

  imageOverlay = L.imageOverlay(era.image, imageBounds).addTo(map);
  map.fitBounds(imageBounds);

  era.points.forEach(point => {
    const marker = L.marker(point.coord)
      .addTo(map)
      .bindPopup(`
        <h3>${point.name}</h3>
        <p>${point.text}</p>
      `);

    markers.push(marker);
  });

  document.getElementById("eraPeriod").textContent = era.period;
  document.getElementById("eraTitle").textContent = era.title;
  document.getElementById("eraSummary").textContent = era.summary;

  const cards = document.getElementById("eraCards");
  cards.innerHTML = "";

  era.cards.forEach(card => {
    cards.innerHTML += `
  <article class="card">
    ${card.image ? `<img class="card-img" src="${card.image}" alt="${card.title}">` : ""}
    <h3>${card.title}</h3>
    <p>${card.text}</p>
  </article>
`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();

  document.querySelectorAll(".era-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".era-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      updateEra(button.dataset.era);
    });
  });

  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
      });
    });
  }
});