import Swal from "sweetalert2";

const validateInputs = (inputs) => {
  let emptyInputs = [];
  for (const input of inputs) {
    if (input.type === 'text' && input.value.trim() === '') {
      emptyInputs.push(input.name);
    }
    if (input.type === 'number' && input.value === '' || input.value === 0) {
      emptyInputs.push(input.name);
    }
    if (input.type === 'select' && input.value === '') {
      emptyInputs.push(input.name);
    }
    if (input.type === 'date' && input.value === '') {
      emptyInputs.push(input.name);
    }
    if (input.type === 'file' && (!input.value || input.value.length === 0)) {
      emptyInputs.push(input.name);
    }
    if (input.type === 'password' && input.value === '') {
      emptyInputs.push(input.name);
    }

    if (input.type === 'email' && input.value.trim() === '') {
      emptyInputs.push(input.name);
    }

    if (input.type === 'textarea' && input.value.trim() === '') {
      emptyInputs.push(input.name);
    }

  }
  if (emptyInputs.length > 0) {

    Swal.fire({
      title: 'Error!',
      text: `Los siguientes campos son obligatorios: ${emptyInputs.join(', ')}`,
      icon: 'error',
      confirmButtonText: 'Ok'

    });
    return false;
  } else {
    return true;
  }
}

const successAlert = (message) => {
  Swal.fire({
    title: message,
    icon: 'success',
    showConfirmButton: false,
    timer: 1500
  });
}

const existAlert = (message) => {
  Swal.fire({
    title: message,
    icon: 'warning',
    showConfirmButton: false,
    timer: 1500
  });
}

export { validateInputs, successAlert, existAlert };