/**
 * 
 * @param date @param{Date|null}
 * @returns  {String}
 */
export function formatDate(date) {
    if (!date) return
    const formatter = new Intl.DateTimeFormat('es-AR', {
      day: "2-digit",
      month: "2-digit",
      year: '2-digit',
      minute: "2-digit",
      hour: '2-digit', hour12: false
    })
    return formatter.format(date).replace(',', ' ')
    //Formatter para date de creacion de mensaje
  }