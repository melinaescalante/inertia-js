/**
 * 
 * @param date @param{Date|null}
 * @returns  {String}
 */
export function formatDate(timestamp) {
  if (!timestamp) return;

  // Convertir el timestamp a un objeto Date si tiene 'seconds' y 'nanoseconds'
  let date;
  if (timestamp.seconds && timestamp.nanoseconds) {
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else {
      date = new Date(timestamp); // Para otros tipos de fecha ya compatibles
  }

  const formatter = new Intl.DateTimeFormat('es-AR', {
      day: "2-digit",
      month: "2-digit",
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  });
  return formatter.format(date).replace(',', ' ');
}
