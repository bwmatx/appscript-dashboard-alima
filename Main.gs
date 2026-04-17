// Entry point Web App
// Fungsi ini akan dieksekusi pertama kali saat URL Web App dibuka
function doGet(e) {
  // Membuat template HTML dari file index.html
  const template = HtmlService.createTemplateFromFile('index');
  
  // Mengevaluasi template dan mengatur konfigurasi halaman
  return template.evaluate()
      .setTitle('Alima Photo Dashboard') // Judul tab browser
      .addMetaTag('viewport', 'width=device-width, initial-scale=1') // Agar responsif di HP
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi helper untuk menyisipkan file HTML parsial (seperti style, script, komponen)
// ke dalam index.html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}