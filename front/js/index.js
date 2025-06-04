async function init() {
  const data = await getData();
  displayData(data);
}
init();

async function getData() {
  try {
    const req = await fetch("http://localhost:3000/api/products/");
    return await req.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

function displayData(data) {
  console.log(data);
  data.forEach(({ _id, titre, image }) => {
    const article = `
      <article>
        <img src="${image}" alt="${titre}">
        <a href="product.html?id=${_id}">${titre}</a>
      </article>`;

    document
      .querySelector(".products")
      .insertAdjacentHTML("beforeend", article);
  });
}
