async function init() {
  const data = await getData();
  const products = await recoverLocalStorage();
  compareData(data, products);
  // deleteProduct();
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
    return products;
  } catch (error) {
    console.error("Failed to recover local storage:", error);
  }
}

function compareData(data, products) {
  const tbody = document.querySelector("tbody");
  let hasProducts = false;

  // voir si on peut pas fusionner les les articles du panier (même _id et format)
  // pour ensuite additionner les quantités

  data.forEach((item) => {
    products.forEach((product) => {
      if (item._id === product._id) {
        item.declinaisons.forEach((declinaison) => {
          if (declinaison.taille === product.format) {
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
        });
      }
    });
  });

  if (!hasProducts) {
    tbody.innerHTML = "<tr><td colspan='6'>Panier vide</td></tr>";
    console.log("Le panier est vide");
  }
}

// solution sur internet a pour supprimer un produit du panier
// voir si on peut l'adapter pour supprimer un produit du panier
// function deleteProduct() {
//   const buttons = document.querySelectorAll(".delete-article");

//   buttons.forEach((button, index) => {
//     button.addEventListener("click", () => {
//       const product = button.parentElement.parentElement;
//       product.remove();

//       const products = JSON.parse(localStorage.getItem("products"));
//       products.splice(index, 1);
//       localStorage.setItem("products", JSON.stringify(products));

//       console.log("Produit supprimé");
//     });
//   });
// }
