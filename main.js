let map;
let imageOverlay;
let markers = [];
let currentMode = null;

const imageBounds = [
  [0, 0],
  [900, 1200]
];

function clearMapInstance() {
  if (map) {
    map.remove();
    map = null;
  }
  imageOverlay = null;
  markers = [];
}

function createImageMap() {
  clearMapInstance();

  map = L.map("imageMap", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 3,
    zoomControl: true,
    maxBounds: imageBounds,
    maxBoundsViscosity: 0.4
  });

  currentMode = "image";
}

function createOSMMap() {
  clearMapInstance();

  map = L.map("imageMap", {
    center: [25.0715, 121.5225],
    zoom: 17,
    minZoom: 14,
    maxZoom: 18,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
    maxNativeZoom: 18
  }).addTo(map);

  currentMode = "osm";
}

function openImageModal(src, title) {
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
    <div class="image-modal-content">
      <button class="modal-close">×</button>
      <img src="${src}" alt="${title}">
      <p>${title}</p>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".modal-close").onclick = () => modal.remove();
  modal.onclick = e => {
    if (e.target === modal) modal.remove();
  };
}

function buildPopup(point) {
  return `
    <div class="map-popup">
      ${
        point.image
          ? `<img class="popup-img" src="${point.image}" alt="${point.name}" onclick="openImageModal('${point.image}', '${point.name}')">`
          : ""
      }
      <h3>${point.name}</h3>
      <p>${point.text}</p>
    </div>
  `;
}

function updateEra(eraKey) {
  const era = window.eraData[eraKey];

  if (era.mapType === "osm") {
    if (currentMode !== "osm") {
      createOSMMap();
    }

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    era.points.forEach(point => {
      const marker = L.marker(point.coord)
        .addTo(map)
        .bindPopup(buildPopup(point));

      markers.push(marker);
    });

    map.setView([25.0715, 121.5225], 17);
  } else {
    if (currentMode !== "image") {
      createImageMap();
    }

    if (imageOverlay) {
      map.removeLayer(imageOverlay);
    }

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    imageOverlay = L.imageOverlay(era.image, imageBounds).addTo(map);
    map.fitBounds(imageBounds);

    era.points.forEach(point => {
      const marker = L.marker(point.coord)
        .addTo(map)
        .bindPopup(buildPopup(point));

      markers.push(marker);
    });

    map.on("click", function (e) {
      console.log("coord:", [
        Math.round(e.latlng.lat),
        Math.round(e.latlng.lng)
      ]);
    });
  }

  document.getElementById("eraPeriod").textContent = era.period;
  document.getElementById("eraTitle").textContent = era.title;
  document.getElementById("eraSummary").textContent = era.summary;

  const cards = document.getElementById("eraCards");
  cards.innerHTML = "";

  era.cards.forEach(card => {
    cards.innerHTML += `
      <article class="card">
        ${
          card.image
            ? `<img class="card-img" src="${card.image}" alt="${card.title}" onclick="openImageModal('${card.image}', '${card.title}')">`
            : ""
        }
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateEra("era1914");

  document.querySelectorAll(".era-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".era-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      updateEra(button.dataset.era);
    });
  });
});