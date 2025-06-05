function orderValidation(message, title = "") {
  const modal = document.createElement("dialog");

  if (title) {
    const h1 = document.createElement("h1");
    h1.textContent = title;
    modal.appendChild(h1);
  }
  if (message) {
    const p = document.createElement("p");
    p.textContent = message;
    modal.appendChild(p);
  }

  document.body.appendChild(modal);
  modal.showModal();

  setTimeout(() => {
    modal.close();
    modal.remove();
  }, 3000);
}

const btnvalid = document.querySelector(".btn-checkout");
btnvalid.addEventListener("click", () => {
  orderValidation("Votre commande a bien été envoyée !", "Commande validée");
});
