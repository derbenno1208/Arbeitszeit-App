const CACHE_NAME = "arbeitszeit-cache-v1";
const urlsToCache = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// Installieren: Dateien cachen
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Abrufen: aus Cache oder Netz
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

function exportCSV() {
  if (entries.length === 0) {
    alert("Keine Einträge vorhanden!");
    return;
  }

  // CSV-Header
  let csv = "Datum,Start,Ende,Pause (Minuten),Stunden\n";

  // Alle Einträge in CSV-Format umwandeln
  entries.forEach(e => {
    csv += `${e.date},${e.start},${e.end},${e.break},${e.hours.toFixed(2)}\n`;
  });

  // Blob erzeugen (Datei im Browser)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Download-Link erstellen
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "arbeitszeiten.csv"; // Dateiname
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel() {
  if (entries.length === 0) {
    alert("Keine Einträge vorhanden!");
    return;
  }

  // Daten vorbereiten
  const data = [
    ["Datum", "Start", "Ende", "Pause (Minuten)", "Stunden"], // Header
    ...entries.map(e => [e.date, e.start, e.end, e.break, e.hours.toFixed(2)])
  ];

  // Neues Workbook erstellen
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Arbeitszeiten");

  // Datei speichern
  XLSX.writeFile(wb, "arbeitszeiten.xlsx");
}
