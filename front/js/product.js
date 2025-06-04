async function init() {
  const data = await getData();
  displayData(data);
  getLocalStorage(data);
}
init();

async function getData() {
  try {
    const req = await fetch(
      "http://localhost:3000/api/products/" +
        new URLSearchParams(window.location.search).get("id")
    );
    return await req.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

function displayData({ titre, image, description, declinaisons, shorttitle }) {
  const shortdescription = description.split("\n")[0] + ".."; // [0] pour obtenir la première ligne / [1] chaine de caractère vide / [2]  pour obtenir la deuxieme ligne
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

  document.querySelector(".detailoeuvre").innerHTML = article;

  const select = document.querySelector("select");
  const priceDisplay = document.querySelector(".showprice");

  declinaisons.forEach((declinaisons, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Format : ${declinaisons.taille}`;
    select.appendChild(option);
  });

  priceDisplay.textContent = `${declinaisons[0].prix}€`;
  select.addEventListener("change", () => {
    const index = select.value;
    priceDisplay.textContent = `${declinaisons[index].prix}€`;
  });

  const buyButton = document.querySelector(".button-buy");
  buyButton.addEventListener("click", (e) => {
    e.preventDefault();

    const quantity = parseInt(document.querySelector("#quantity").value, 10);
    const index = select.value;

    if (index === "" || declinaisons[index] === undefined) {
      alert("Choisissez un format valide avant d’acheter.");
      return;
    }

    const { taille: format, prix: price } = declinaisons[index];

    if (quantity < 1) {
      alert("Vous devez commander au moins une oeuvre");
      return;
    }

    if (quantity > 100) {
      alert("Vous ne pouvez pas commander plus de 100 oeuvres");
      return;
    }

    alert(
      `Vous avez ajouté ${quantity} exemplaire(s) de ${shorttitle} (${format}) au product pour un total de ${
        price * quantity
      }€`
    );
  });
}
function getLocalStorage({ _id, titre, image, shorttitle, declinaisons }) {
  const buttonBuy = document.querySelector(".button-buy");
  buttonBuy.addEventListener("click", (e) => {
    e.preventDefault();

    const quantity = document.querySelector("#quantity").value;
    const index = document.querySelector("#format").value;

    if (index === "") {
      return;
    }

    const format = declinaisons[index].taille;

    const article = {
      _id,
      titre,
      shorttitle,
      image,
      format,
      quantity,
    };

    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(article);
    localStorage.setItem("products", JSON.stringify(products));
  });
}
