// ============================================================
// BookingService.gs
// Catatan: Pastikan kolom STATUS sudah ada di spreadsheet
// (kolom ke-11, setelah Bukti Transfer)
// ============================================================

function getBookings() {
  return fetchAllData();
}

function addBooking(dataObj) {
  const sheet = getDbSheet();
  const newRow = [
    dataObj['Timestamp']     || "",
    dataObj['NAMA CPP CPW']  || "",
    dataObj['TUAN RUMAH']    || "",
    dataObj['ALAMAT']        || "",
    dataObj['TANGGAL']       || "",
    dataObj['JENIS ACARA']   || "",
    dataObj['PILIHAN PAKET'] || "",
    dataObj['Sosial Media']  || "",
    dataObj['DP terbilang']  || "",
    dataObj['Bukti Transfer']|| "",
    dataObj['STATUS']        || ""   // ← kolom STATUS (kolom ke-11)
  ];
  sheet.appendRow(newRow);
  return { success: true, message: "Data berhasil ditambahkan" };
}

function updateBooking(rowIndex, dataObj) {
  const sheet   = getDbSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Salin nilai row yang sudah ada agar kolom lain tidak terhapus
  const existingRow = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  const updateRow   = existingRow.slice();

  // Tulis setiap field dari dataObj ke kolom yang sesuai berdasarkan header
  const fieldMap = {
    'Timestamp'     : 'Timestamp',
    'NAMA CPP CPW'  : 'NAMA CPP CPW',
    'TUAN RUMAH'    : 'TUAN RUMAH',
    'ALAMAT'        : 'ALAMAT',
    'TANGGAL'       : 'TANGGAL',
    'JENIS ACARA'   : 'JENIS ACARA',
    'PILIHAN PAKET' : 'PILIHAN PAKET',
    'Sosial Media'  : 'Sosial Media',
    'DP terbilang'  : 'DP terbilang',
    'Bukti Transfer': 'Bukti Transfer',
    'STATUS'        : 'STATUS'
  };

  Object.keys(fieldMap).forEach(key => {
    const colIdx = headers.findIndex(h => h.toString().trim() === fieldMap[key]);
    if (colIdx !== -1 && dataObj[key] !== undefined) {
      updateRow[colIdx] = dataObj[key];
    }
  });

  sheet.getRange(rowIndex, 1, 1, updateRow.length).setValues([updateRow]);
  return { success: true, message: "Data berhasil diupdate" };
}

function deleteBooking(rowIndex) {
  const sheet = getDbSheet();
  sheet.deleteRow(rowIndex);
  return { success: true, message: "Data berhasil dihapus" };
}
