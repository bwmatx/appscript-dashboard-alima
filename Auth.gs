function loginUser(username, password) {
  try {
    // Menggunakan Active Spreadsheet tempat file script ini berada (dashboard_alima)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.INTERNAL_AUTH_SHEET);
    
    // Auto-create sheet jika belum ada untuk mencegah error
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.INTERNAL_AUTH_SHEET);
      sheet.appendRow(["Username", "Password"]);
      sheet.appendRow(["renggi", "admin123"]); // Akun admin default
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) { // Mulai dari index 1 untuk melewati baris header
      // Pengecekan username dan password
      if (data[i][0] === username && data[i][1] === password) {
        // Jika cocok, kembalikan token unik
        return { success: true, token: Utilities.getUuid() };
      }
    }
    // Jika tidak ada yang cocok
    return { success: false, message: "Username atau Password salah." };
  } catch (e) {
    // Jika terjadi error sistem
    return { success: false, message: e.toString() };
  }
}