const d = new Date('2026-07-31T12:00:00Z');
const arr = Array.from({length: 7}, (_, i) => { 
  const x = new Date(d); 
  x.setDate(x.getDate() - (6-i)); 
  return x; 
}); 
console.log(arr.map(x => x.toISOString().split('T')[0]));
