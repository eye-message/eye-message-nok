export function parseLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// JS Date → "YYYY-MM-DD" 형식 문자열 (로컬 기준!)
export function formatLocalDate(jsDate) {
  if (!(jsDate instanceof Date)) return null;

  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, '0');
  const day = String(jsDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
