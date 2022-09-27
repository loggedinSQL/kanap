// envoyer une requête à l'API
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(value => {
        // générer tous les produits présents dans l'API
        for (let element of value) {

            // récupérer l'élément du DOM qui recueillera les fiches produits
            const section = document.querySelector("#items");

            const link = document.createElement("a");
            link.href = "./product.html?id=" + element._id;
            section.appendChild(link);
            
            const article = document.createElement("article");
            link.appendChild(article);

            article.appendChild(createImage(element));
            article.appendChild(createName(element));
            article.appendChild(createDescription(element));
        }
    })
    .catch(err => {
        // une erreur est survenue
    })


    // implémenter l'image du canape
    const createImage = (canape) => {
        const image = document.createElement("img");
        image.src = canape.imageUrl;
        image.alt = canape.altTxt;
    
        return image;
    }
    
    
    // ajouter le nom du canape
    const createName = (item) => {
        const name = document.createElement("h3");
        name.classList.add("productName");
        name.textContent = item.name;
    
        return name;
    }
    
    
    // ajouter la description du produit
    const createDescription = (item) => {
        const description = document.createElement("p");
        description.classList.add("productDescription");
        description.textContent = item.description;
        
        return description;
    }
    
    