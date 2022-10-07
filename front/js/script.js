// envoyer une requête à l'API
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(value => {
        // générer tous les produits présents dans l'API
        for (let object of value) {

            // récupérer l'élément du DOM qui recueillera les fiches produits
            const section = document.querySelector("#items");

            const link = document.createElement("a");
            link.href = "./product.html?id=" + object._id;
            section.appendChild(link);
            
            const article = document.createElement("article");
            link.appendChild(article);

            article.appendChild(createImage(object));
            article.appendChild(createName(object));
            article.appendChild(createDescription(object));
        }
    })
    .catch(err => {
        // une erreur est survenue
    })


    // créer l'élément image de la fiche produit
    const createImage = (item) => {
        const image = document.createElement("img");
        image.src = item.imageUrl;
        image.alt = item.altTxt;
    
        return image;
    }
    
    
    // ajouter le nom du canape à la fiche
    const createName = (item) => {
        const name = document.createElement("h3");
        name.classList.add("productName");
        name.textContent = item.name;
    
        return name;
    }
    
    
    // implémenter la description du produit à sa fiche
    const createDescription = (item) => {
        const description = document.createElement("p");
        description.classList.add("productDescription");
        description.textContent = item.description;
        
        return description;
    }
    
    