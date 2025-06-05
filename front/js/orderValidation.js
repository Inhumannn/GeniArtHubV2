function secureForm() {
  const form = document.querySelector(".form-group");
  const datas = new FormData(form);
  let valid = true;

  if (datas.get("prenom") === null || datas.get("prenom").length < 2) {
    console.log("Le prénom doit contenir au moins 2 caractères");
    valid = false;
  }

  if (datas.get("nom") === null || datas.get("nom").length < 2) {
    console.log("Le nom doit contenir au moins 2 caractères");
    valid = false;
  }

  if (datas.get("adresse") === null || datas.get("adresse").length < 10) {
    console.log("L'adresse doit contenir au moins 10 caractères");
    valid = false;
  }

  const email = datas.get("mail");
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (email === null || !emailRegex.test(email)) {
    console.log("L'email n'est pas valide");
    valid = false;
  }

  if (valid) {
    console.log("Le formulaire est valide.");
  } else {
    console.log("Formulaire invalide. Merci de corriger les erreurs.");
  }

  return valid;
}

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
btnvalid.addEventListener("click", (e) => {
  e.preventDefault();
  const formValid = secureForm();

  if (!formValid) {
    console.log("");
    orderValidation(
      "Veuillez corriger les erreurs dans le formulaire.",
      "Erreur de validation"
    );
    return;
  }

  if (formValid) {
    orderValidation("Votre commande a bien été envoyée !", "Commande validée");
  }
});
