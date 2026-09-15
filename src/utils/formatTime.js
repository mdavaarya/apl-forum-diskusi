function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000);

  const units = [
    { limit: 60, divisor: 1, label: 'detik' },
    { limit: 3600, divisor: 60, label: 'menit' },
    { limit: 86400, divisor: 3600, label: 'jam' },
    { limit: 2592000, divisor: 86400, label: 'hari' },
    { limit: 31536000, divisor: 2592000, label: 'bulan' },
  ];

  if (diffSeconds < 10) {
    return 'baru saja';
  }

  const unit = units.find((item) => diffSeconds < item.limit);

  if (!unit) {
    const years = Math.floor(diffSeconds / 31536000);
    return `${years} tahun lalu`;
  }

  const value = Math.floor(diffSeconds / unit.divisor);
  return `${value} ${unit.label} lalu`;
}

export default formatRelativeTime;
