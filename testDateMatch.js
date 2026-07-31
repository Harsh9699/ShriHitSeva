const getLocalDateString = (d) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const today = new Date('2026-07-31T13:35:00+05:30'); // Indian time
const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
const upcomingSunday = new Date(today);
upcomingSunday.setDate(today.getDate() + (6 - currentDayIndex));

const last28Days = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(upcomingSunday);
  d.setDate(upcomingSunday.getDate() - (27 - i));
  return d;
});

const monthlyStrings = last28Days.map(getLocalDateString);

const weeklyDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today); // Use same reference time!
  d.setDate(d.getDate() - (6 - i));
  return d;
});
const weeklyStrings = weeklyDays.map(getLocalDateString);

console.log("Monthly strings (last 7):", monthlyStrings.slice(21, 28));
console.log("Weekly strings:", weeklyStrings);
