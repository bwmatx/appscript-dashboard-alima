// ============================================================
// Database.gs — UPDATED
// Otomatis tambah kolom STATUS jika belum ada di sheet
// ============================================================

function getDbSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.EXTERNAL_DB_ID);
  return ss.getSheetByName(CONFIG.EXTERNAL_SHEET_NAME);
}

function toProperCase(str) {
  if (!str) return "";
  return str.toString().toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

function formatToDayMonth(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
  const BULAN = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];
  return dateObj.getDate() + " " + BULAN[dateObj.getMonth()];
}

function parseDate(cellValue) {
  if (!cellValue) return null;
  const BULAN_ID = {
    "januari":0,"jan":0,"februari":1,"feb":1,"maret":2,"mar":2,
    "april":3,"apr":3,"mei":4,"juni":5,"jun":5,"juli":6,"jul":6,
    "agustus":7,"agu":7,"aug":7,"september":8,"sep":8,
    "oktober":9,"okt":9,"oct":9,"november":10,"nov":10,
    "desember":11,"des":11,"dec":11
  };
  if (cellValue instanceof Date) {
    const d = new Date(2026, cellValue.getMonth(), cellValue.getDate());
    return isNaN(d.getTime()) ? null : d;
  }
  const raw    = cellValue.toString().trim();
  const rawLow = raw.toLowerCase();
  const namaMatch = rawLow.match(/^(\d{1,2})\s+([a-z]+)/i);
  if (namaMatch) {
    const day      = parseInt(namaMatch[1], 10);
    const monthIdx = BULAN_ID[namaMatch[2].toLowerCase()];
    if (monthIdx !== undefined && day >= 1 && day <= 31) {
      return new Date(2026, monthIdx, day);
    }
  }
  const numMatch = raw.match(/^(\d{1,2})[\/\-\.](\d{1,2})/);
  if (numMatch) {
    const day   = parseInt(numMatch[1], 10);
    const month = parseInt(numMatch[2], 10) - 1;
    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      return new Date(2026, month, day);
    }
  }
  return null;
}

// ============================================================
// ENSURE kolom STATUS ada di sheet (auto-create jika belum)
// Dipanggil sekali saat fetchAllData
// ============================================================
function ensureStatusColumn(sheet) {
  const headers    = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusIdx  = headers.findIndex(h => h.toString().trim().toUpperCase() === 'STATUS');
  if (statusIdx === -1) {
    // Kolom STATUS belum ada → tambahkan di kolom berikutnya
    const newColIdx = sheet.getLastColumn() + 1;
    sheet.getRange(1, newColIdx).setValue('STATUS');
    Logger.log('Kolom STATUS ditambahkan di kolom ' + newColIdx);
    return newColIdx - 1; // return sebagai 0-based index
  }
  return statusIdx; // sudah ada, return posisinya
}

// ============================================================
// MAIN: Ambil semua data, standarisasi, urutkan
// ============================================================
function fetchAllData() {
  const sheet = getDbSheet();
  if (!sheet) {
    throw new Error("Sheet '" + CONFIG.EXTERNAL_SHEET_NAME + "' tidak ditemukan di External DB.");
  }

  // Pastikan kolom STATUS selalu ada
  ensureStatusColumn(sheet);

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];

  const PROPER_CASE_COLS = ["NAMA CPP CPW", "TUAN RUMAH", "JENIS ACARA", "PILIHAN PAKET", "ALAMAT"];
  const DATE_COLS        = ["TANGGAL", "TIMESTAMP"];

  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Abaikan baris kosong
    if (!row[0] && !row[1]) continue;

    const obj = { _rowIndex: i + 1 };

    for (let j = 0; j < headers.length; j++) {
      let cellValue   = row[j];
      const headerRaw = headers[j] ? headers[j].toString() : "";
      const headerKey = headerRaw.toUpperCase().trim();

      if (DATE_COLS.includes(headerKey)) {
        const parsed = parseDate(cellValue);
        if (parsed) {
          obj["_rawDate"] = parsed.getTime();
          cellValue       = formatToDayMonth(parsed);
        } else {
          cellValue = cellValue ? cellValue.toString() : "";
        }
      } else if (PROPER_CASE_COLS.includes(headerKey)) {
        cellValue = toProperCase(cellValue);
      } else {
        // Kolom lain (termasuk STATUS) → simpan apa adanya sebagai string
        cellValue = cellValue !== undefined && cellValue !== null ? cellValue.toString() : "";
      }

      obj[headerRaw] = cellValue;
    }

    rows.push(obj);
  }

  rows.sort((a, b) => (a["_rawDate"] || 0) - (b["_rawDate"] || 0));
  return rows;
}

// ============================================================
// NOTIF: Ambil jumlah booking terbaru
// ============================================================
function getBookings() {
  return fetchAllData(); // pakai function yang sudah ada
}
