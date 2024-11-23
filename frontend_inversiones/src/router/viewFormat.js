///modulo de tranformar datos para vistas

export function formatDate(date) { 
    const parsedDate = new Date(date);
    // si la fecha es invalida ->
    if (isNaN(parsedDate.getTime())) {
      return 'sin fecha';
    }
    return parsedDate.toLocaleDateString();
}