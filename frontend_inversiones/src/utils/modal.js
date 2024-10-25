const openModal = (modalId) => {
  var myModalEl = document.getElementById(modalId);
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
}

const closeModal = (modalId) => {
  var myModalEl = document.getElementById(modalId);
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();
}

export { openModal, closeModal };