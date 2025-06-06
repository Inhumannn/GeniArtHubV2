async function init() {
  // Initialisation de la page d'accueil
  const data = await getData();
  displayData(data);
}
init();

async function getData() {
  // Récupération des données depuis l'API
  try {
    const req = await fetch("http://localhost:3000/api/products/"); // URL de l'API
    return await req.json(); // Conversion de la réponse en JSON
  } catch (error) {
    throw new Error(error.message);
  }
}

function displayData(data) {
  // Affichage des données sur la page
  data.forEach(({ _id, titre, image }) => {
    // Pour chaque produit, on crée un article
    // Destructuration de l'objet 
    const article = `
      <article>
        <img src="${image}" alt="${titre}">
        <a href="product.html?id=${_id}">${titre}</a>
      </article>`;

    document.querySelector(".products").innerHTML += article; // Ajout de l'article sur la page
  });
}
