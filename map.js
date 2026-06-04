const map = L.map("map").setView([25.0710, 121.5230], 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

locations.forEach((place) => {
  const imageHtml = place.image
    ? `<img class="popup-img" src="${place.image}" alt="${place.name}" />`
    : "";

  L.marker([place.lat, place.lng])
    .addTo(map)
    .bindPopup(`
      <h3>${place.name}</h3>
      <p><strong>${place.year}</strong></p>
      ${imageHtml}
      <p>${place.description}</p>
    `);
});