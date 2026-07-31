const getLocalDateString = (d) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const arr = Array.from({ length: 7 }, (_, i) => {
  const d = new Date('2026-07-31T12:00:00Z');
  d.setDate(d.getDate() - (6 - i));
  return d;
});

arr.forEach((date, i) => {
  console.log(`Index ${i}: ${date.toString()} => ${getLocalDateString(date)}`);
});
