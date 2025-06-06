async function init() {
  const data = await getData();
  displayData(data);
  getLocalStorage(data);
}
init();

async function getData() {
  // Récupère les données de l'API
  try {
    const req = await fetch(
      "http://localhost:3000/api/products/" +
        new URLSearchParams(window.location.search).get("id") // Récupère l'ID du produit depuis l'URL
      // window.location.search permet de récupérer la partie de l'URL après le ?
    );
    return await req.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

function displayData({ titre, image, description, declinaisons, shorttitle }) {
  // Affiche les données dans le DOM
  // Destructuration de l'objet
  const shortdescription = description.split("\n")[0] + "..";
  // [0] pour obtenir la première ligne / [1] chaine de caractère vide / [2]  pour obtenir la deuxieme ligne
  const article = `
    <article>
      <figure>
        <img src="${image}" alt="${titre}" />
      </figure>
      <div>
        <h1>${titre}</h1>
        <p>${shortdescription}</p>
        <div class="price">
          <p>Acheter pour</p>
          <span class="showprice">09.99€</span>
        </div>
        <div class="declinaison">
          <input
            type="number"
            name="quantity"
            id="quantity"
            placeholder="1"
            value="1"
            min="1"
            max="100"
          />
          <select name="format" id="format">
            <option value="" disabled selected>Choisir un format</option>
          </select>
        </div>
        <a class="button-buy" href="#">Buy ${shorttitle}</a>
      </div>
    </article>

    <aside>
      <h2>Description de l’œuvre :</h2>
      <p>${description.replace(/\n/g, "<br />")}</p>
    </aside>`;
  // description.replace(/\n/g, "<br />") sert à remplacer les sauts de ligne par des balises <br> pour l'affichage HTML
  document.querySelector(".detailoeuvre").innerHTML = article;

  const select = document.querySelector("select");
  const priceDisplay = document.querySelector(".showprice");

  declinaisons.forEach((declinaisons, index) => {
    // Pour chaque déclinaison, on crée une option dans le select
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Format : ${declinaisons.taille}`;
    select.appendChild(option);
  });

  priceDisplay.textContent = `${declinaisons[0].prix}€`;
  select.addEventListener("change", () => {
    // Met à jour le prix affiché en fonction de la sélection
    const index = select.value;
    priceDisplay.textContent = `${declinaisons[index].prix}€`; // Affiche le prix de la déclinaison sélectionnée
  });

  const buyButton = document.querySelector(".button-buy");
  buyButton.addEventListener("click", (e) => {
    e.preventDefault();

    const quantity = parseInt(document.querySelector("#quantity").value); // Récupère la quantité saisie par l'utilisateur
    const index = select.value;

    if (index === "" || declinaisons[index] === undefined) {
      // Vérifie si un format a été sélectionné
      alert("Choisissez un format valide avant d’acheter.");
      return;
    }

    const { taille: format, prix: price } = declinaisons[index]; // Récupère le format et le prix de la déclinaison sélectionnée

    if (quantity < 1) {
      // Vérifie si la quantité est valide
      alert("Vous devez commander au moins une oeuvre");
      return;
    }

    if (quantity > 100) {
      // Vérifie si la quantité ne dépasse pas 100
      alert("Vous ne pouvez pas commander plus de 100 oeuvres");
      return;
    }

    alert(
      // Affiche un message de confirmation
      `Vous avez ajouté ${quantity} exemplaire(s) de ${shorttitle} (${format}) au product pour un total de ${
        price * quantity
      }€`
    );
  });
}
function getLocalStorage({ _id, titre, image, shorttitle, declinaisons }) {
  // Récupère les données du localStorage et ajoute un article au panier
  const buttonBuy = document.querySelector(".button-buy");
  buttonBuy.addEventListener("click", (e) => {
    // Ajoute un écouteur d'événement au bouton d'achat
    e.preventDefault();

    const quantity = document.querySelector("#quantity").value;
    const index = document.querySelector("#format").value;

    if (index === "") {
      // si index est vide, on ne peut pas ajouter l'article
      return; // return rien
    }

    const format = declinaisons[index].taille;
    // declinaisons[index] permet de récupérer la déclinaison sélectionnée dans le select

    const article = {
      // Création de l'article à ajouter au panier
      _id,
      titre,
      shorttitle,
      image,
      format,
      quantity,
    };

    const products = JSON.parse(localStorage.getItem("products")) || []; // Récupère les produits du localStorage ou initialise un tableau vide
    products.push(article); // Ajoute l'article au tableau des produits
    localStorage.setItem("products", JSON.stringify(products)); // Enregistre le tableau des produits dans le localStorage
  });
}
