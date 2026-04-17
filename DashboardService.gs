// ============================================================
// DashboardService.gs
// Acara terdekat: 60 hari ke depan
// ============================================================

function getDashboardData() {
  const bookings = fetchAllData();
  const today    = new Date();
  today.setHours(0, 0, 0, 0);

  let totalBookings  = bookings.length;
  let belumSelesai   = 0;
  let sudahSelesai   = 0;
  let upcoming       = [];

  bookings.forEach(b => {
    const isSelesai = b['STATUS'] && b['STATUS'].toString().toLowerCase() === 'selesai';
    if (isSelesai) sudahSelesai++;
    else           belumSelesai++;

    if (b['_rawDate']) {
      const eventDate = new Date(b['_rawDate']);
      const diffDays  = (eventDate - today) / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays <= 60) {
        upcoming.push(b);
      }
    }
  });

  upcoming.sort((a, b) => (a['_rawDate'] || 0) - (b['_rawDate'] || 0));

  return {
    total          : totalBookings,
    missingTransfer: sudahSelesai,   // ← "Selesai"
    missingDp      : belumSelesai,   // ← "Belum Selesai"
    upcoming       : upcoming,
    rawData        : bookings
  };
}
