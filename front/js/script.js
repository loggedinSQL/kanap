// envoyer une requête à l'API
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(value => {
        // générer tous les produits présents dans l'API
        for (let element of value) {

            // récupérer l'élément du DOM qui recueillera les fiches produits
            const section = document.querySelector("#items");

            // créer la fiche en récupérant les données du produit
            const link = document.createElement("a");
            link.href = "./product.html?id=" + element._id;
            section.appendChild(link);

            const article = document.createElement("article");
            link.appendChild(article);

            const image = document.createElement("img");
            image.src = element.imageUrl;
            image.alt = element.altTxt;
            article.appendChild(image);

            const name = document.createElement("h3");
            name.classList.add("productName");
            name.textContent = element.name;
            article.appendChild(name);

            const description = document.createElement("p");
            description.classList.add("productDescription");
            description.textContent = element.description;
            article.appendChild(description);
        }
    })
    .catch(err => {
        // une erreur est survenue
    })

