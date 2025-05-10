///modulo de tranformar datos para vistas

export function formatDate(date) { 
    const parsedDate = new Date(date);
    // si la fecha es invalida ->
    if (isNaN(parsedDate.getTime())) {
      return 'sin fecha';
    }
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${day}/${month}/${year}`;
}

export function standardFormatDate(d) { 
    if (!d) return "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [day, month, year] = d.split("/");
      const formattedDate = new Date(`${year}-${month}-${day}`);
      if (isNaN(formattedDate.getTime())) {
        console.error("Invalid date after conversion:", `${year}-${month}-${day}`);
        return "";
      }
      return formattedDate.toISOString().split("T")[0];
    }
    const date = new Date(d);
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", d);
      return ""; 
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
