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
      merge.quantity += product.quantity;
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

  products.forEach((product) => {
    const items = data.find((item) => {
      // stop la boucle contrairement à forEach
      // on cherche dans le tableau data si l'id du produit correspond à un id d'un item
      return item._id === product._id;
    });
    if (items) {
      const declinaison = items.declinaisons.find((d) => {
        return d.taille === product.format;
      });
      if (declinaison) {
        hasProducts = true;
        const total = declinaison.prix * product.quantity;
        const article = `
          <tr>
            <td>${product.titre}</td>
            <td>${product.format}</td>
            <td>${declinaison.prix}€</td>
            <td>${product.quantity}</td>
            <td>${total}€</td>
            <td><button class="delete-article">×</button></td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", article);
      }
    }
  });

  if (!hasProducts) {
    tbody.innerHTML = "<tr><td colspan='6'>Panier vide</td></tr>";
    console.log("Le panier est vide");
  }
}

function deleteProduct() {
  const deleteButtons = document.querySelectorAll(".delete-article");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Suppression du produit");
    });
  });
}
