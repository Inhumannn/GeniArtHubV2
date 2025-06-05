async function init() {
  const data = await getData();
  const products = await recoverLocalStorage();
  compareData(data, products);
  deleteProduct(products);
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

function recoverLocalStorage() {
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
  let hasProducts = false;
  let totalGeneral = 0;

  products.forEach((product) => {
    const items = data.find((item) => item._id === product._id);
    if (items) {
      const declinaison = items.declinaisons.find(
        (d) => d.taille === product.format
      );
      if (declinaison) {
        hasProducts = true;
        const total = declinaison.prix * product.quantity;
        totalGeneral += total; // ajouter au total général
        const article = `
          <tr>
            <td>${product.titre}</td>
            <td>${product.format}</td>
            <td>${declinaison.prix}€</td>
            <td>${product.quantity}</td>
            <td>${total}€</td>
            <td><button class="delete-article" data-id="${product._id}" data-format="${product.format}">×</button></td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", article);
      }
    }
  });

  if (!hasProducts) {
    tbody.innerHTML = "<tr><td colspan='6'>Panier vide</td></tr>";
  }

  const totalPrice = document.querySelector(".total");
  if (totalPrice) {
    totalPrice.textContent = `${totalGeneral}€`;
  }
}

function deleteProduct(products) {
  const deleteButtons = document.querySelectorAll(".delete-article");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id; // récupère l'id et le format du produit à supprimer
      const format = button.dataset.format; // data-id et data-format sur le bouton

      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === id && products[i].format === format) {
          products[i].quantity -= 1;
          if (products[i].quantity <= 0) {
            products.splice(i, 1);
          }
          localStorage.setItem("products", JSON.stringify(products));
          location.reload();
          break;
        }
      }
    });
  });
}
