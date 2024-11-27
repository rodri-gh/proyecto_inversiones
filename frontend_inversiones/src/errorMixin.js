import Swal from "sweetalert2";

export const handleErrorSwal = (error, defaultMessage) => {
  console.error(error);
  //const errorMessage = error.response?.data?.message || defaultMessage;
  const errorMessage = defaultMessage;
  Swal.fire("Error", errorMessage, "error");
};