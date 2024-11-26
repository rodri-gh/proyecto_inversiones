///modulo de tranformar datos para vistas

export function formatDate(date) { 
    const parsedDate = new Date(date);
    // si la fecha es invalida ->
    if (isNaN(parsedDate.getTime())) {
      return 'sin fecha';
    }
    return parsedDate.toLocaleDateString();
}

export function standardFormatDate(d) { 
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
