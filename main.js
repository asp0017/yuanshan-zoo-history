// 圓山動物園舊址附近
const yuanshan = [25.0715, 121.5225];

const map = L.map("imageMap", {
  center: yuanshan,
  zoom: 15,
  minZoom: 10,
  maxZoom: 18,
  zoomControl: true
});

function sinicaLayer(layerId, format = "image/jpeg") {
  return L.tileLayer(
    `https://gis.sinica.edu.tw/tileserver/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layerId}&STYLE=_null&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=${format}`,
    {
      attribution: "地圖來源：中央研究院臺灣百年歷史地圖",
      minZoom: 10,
      maxZoom: 18,
      tileSize: 256
    }
  );
}

// 先用比較確定的圖層
const baseLayers = {
  "1921 日治臺灣堡圖": sinicaLayer("JM20K_1921", "image/jpeg"),
  "1944 美軍地形圖": sinicaLayer("AM25K_1944A", "image/jpeg"),
  "1957-1969 臺灣地形圖": sinicaLayer("TM25K_1966", "image/jpeg"),
  "現代 OpenStreetMap": L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors"
    }
  )
};

// 先載入 OSM，確認座標與地圖本身正常
baseLayers["現代 OpenStreetMap"].addTo(map);

L.control.layers(baseLayers, null, {
  collapsed: false
}).addTo(map);

L.marker(yuanshan)
  .addTo(map)
  .bindPopup(`
    <h3>圓山動物園舊址</h3>
    <p>1914－1986 年間，臺北市立動物園位於圓山一帶。</p>
  `)
  .openPopup();