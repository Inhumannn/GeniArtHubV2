let products = []; // Tableau pour stocker les produits du panier pour plus tard

async function init() {
  const data = await getData(); // Récupère les données de l'API
  products = await recoverLocalStorage(); // Récupère les produits du localStorage
  compareData(data, products); // Compare les données de l'API avec celles du localStorage
  deleteProduct(products); // Ajoute la fonctionnalité de suppression des produits du panier
}
init();

async function getData() {
  try {
    const req = await fetch("http://localhost:3000/api/products");
    return await req.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

async function recoverLocalStorage() {
  try {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    return mergeProducts(products);
  } catch (error) {
    console.error("Failed to recover local storage:", error);
  }
}

function mergeProducts(products) {
  const mergeArray = [];
  // On parcourt le tableau products pour fusionner les produits
  // ayant le même id et le même format
  products.forEach((product) => {
    const merge = mergeArray.find(
      // Vérifie si un produit avec le même identifiant (_id) et le même format existe déjà dans mergeArray
      // (p) est un paramètre de la fonction fléchée qui représente chaque produit dans mergeArray
      (p) => p._id === product._id && p.format === product.format
    );
    if (merge) {
      merge.quantity = Number(merge.quantity) + Number(product.quantity);
      // Number() sinon additionne une chaîne de caractères
    } else {
      // { ...product } crées une copie indépendante, se qui permet de ne pas modifier l'original
      mergeArray.push({ ...product });
    }
  });

  return mergeArray;
}

function compareData(data, products) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Vide le tbody avant de le remplir
  let hasProducts = false; // Indique s'il y a des produits à afficher
  let totalGeneral = 0; // Initialise le total général à 0

  products.forEach((product) => {
    const items = data.find((item) => item._id === product._id);
    if (items) {
      const declinaison = items.declinaisons.find(
        (d) => d.taille === product.format
      );
      if (declinaison) {
        hasProducts = true;
        const total =
          Math.round(declinaison.prix * product.quantity * 100) / 100; // arrondir à 2 décimales
        totalGeneral += total;
        const article = `
          <tr>
            <td>${product.titre}</td>
            <td>${product.format}</td>
            <td>${declinaison.prix}€</td>
            <td>${product.quantity}</td>
            <td>${total.toFixed(2)}€</td>
            <td><button class="delete-article" data-id="${
              product._id
            }" data-format="${product.format}">×</button></td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", article);
      }
    }
  });

  if (!hasProducts) {
    // Si aucun produit n'est trouvé, on affiche un message
    tbody.innerHTML = "<tr><td colspan='6'>Panier vide</td></tr>";
  }

  const totalPrice = document.querySelector(".total");
  if (totalPrice) {
    // si totalPrice existe on affiche
    totalPrice.textContent = `${totalGeneral.toFixed(2)}€`; // arrondir à 2 décimales
  }
}

function deleteProduct(products) {
  const deleteButtons = document.querySelectorAll(".delete-article");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id; // récupère l'id et le format du produit à supprimer
      const format = button.dataset.format; // data-id et data-format sur le bouton

      for (let i = 0; i < products.length; i++) {
        // Parcourt le tableau products pour trouver le produit à supprimer
        if (products[i]._id === id && products[i].format === format) {
          // Si le produit est trouvé, on le supprime
          products[i].quantity -= 1;
          // On décrémente la quantité du produit de 1
          if (products[i].quantity <= 0) {
            // Si la quantité est inférieure ou égale à 0, on supprime le produit du tableau
            products.splice(i, 1); // Supprime le produit du tableau avec splice
          }
          // Met à jour le localStorage avec le tableau modifié
          localStorage.setItem("products", JSON.stringify(products));
          location.reload();
          break;
        }
      }
    });
  });
}

// orderValidation
function secureForm(contact) {
  const form = document.querySelector(".form-group");
  const datas = new FormData(form); // Récupère les données du formulaire
  let valid = true; // Variable pour vérifier la validité du formulaire

  // Vérification des champs du formulaire si null ou trop courts
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
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Regex pour valider l'email
  if (email === null || !emailRegex.test(email)) {
    console.log("L'email n'est pas valide");
    valid = false;
  }

  // si le formulaire est valide
  if (valid) {
    console.log("Le formulaire est valide.");

    const form = document.querySelector(".form-group");
    const datas = new FormData(form);

    return {
      firstName: datas.get("prenom"),
      lastName: datas.get("nom"),
      address: datas.get("adresse"),
      ville: "Paris",
      email: datas.get("mail"),
    };
  }
}

async function getOrderNumber(contact, products) {
  try {
    const req = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, products }),
    });

    const res = await req.json();
    console.log("Numéro de commande:", res.orderId);

    localStorage.setItem("orderId", res.orderId); // Stocke le numéro de commande dans le localStorage
    // localStorage.removeItem("products"); // Vide le panier
    // document.querySelector(".form-group").reset(); // Réinitialise le formulaire
    // window.location.href = "confirmation.html"; // Redirige vers une page de confirmation
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du numéro de commande:",
      error
    );
  }
}

function orderValidation(message, title = "") {
  // Crée un modal pour afficher le message de validation
  const modal = document.createElement("dialog");

  if (title) {
    // Si un titre est fourni, on l'affiche
    const h1 = document.createElement("h1");
    h1.textContent = title;
    modal.appendChild(h1);
  }
  if (message) {
    // Si un message est fourni, on l'affiche
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
btnvalid.addEventListener("click", async (e) => {
  e.preventDefault();
  const contact = secureForm();

  // Si le formulaire n'est pas valide, on affiche un message d'erreur
  if (!contact) {
    console.log("");
    orderValidation(
      "Veuillez corriger les erreurs dans le formulaire.",
      "Erreur de validation"
    );
    return;
  }

  // Si le formulaire est valide, on envoie la commande
  try {
    await getOrderNumber(contact, products);
    orderValidation("Votre commande a bien été envoyée !", "Commande validée");
  } catch (err) {
    orderValidation(err, "Erreur de commande");
    console.error(err);
  }
});

// console err
// Le formulaire est valide.
//POST http://localhost:3000/api/products/order 400 (Bad Request)
//Numéro de commande: undefined
