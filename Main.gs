// Entry point Web App
// Fungsi ini akan dieksekusi pertama kali saat URL Web App dibuka
function doGet(e) {
  // Membuat template HTML dari file index.html
  const template = HtmlService.createTemplateFromFile('index');
  
  // =========================================================================
  // ISI EDITAN BARU UNTUK BLOGGER:
  // Tangkap parameter '?page=...' dari URL Blogger yang diteruskan ke iFrame.
  // Jika tidak ada parameter (baru buka web), otomatis diatur ke 'login'.
  // =========================================================================
  template.page = e.parameter.page || 'login';
  
  // Mengevaluasi template dan mengatur konfigurasi halaman
  return template.evaluate()
      .setTitle('Alima Photo Dashboard') // Judul tab browser
      .addMetaTag('viewport', 'width=device-width, initial-scale=1') // Agar responsif di HP
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Wajib agar bisa masuk iFrame Blogger
}

// Fungsi helper untuk menyisipkan file HTML parsial (seperti style, script, komponen)
// ke dalam index.html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}