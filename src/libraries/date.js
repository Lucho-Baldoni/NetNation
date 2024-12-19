/**
 * Formatea una fecha en el formato "DD/MM/AAAA hh:mm".
 * 
 * @param {Date|null} date - La fecha a formatear. Si es null, retorna null.
 * @returns {String|null} La fecha formateada en el formato "DD/MM/AAAA hh:mm", o null si la fecha es null.
 */
export function formatDate(date) {
    if(!date) return null;

    // Formato a la fecha.
    const formatter = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
    });
    return formatter.format(date).replace(',', '');
}