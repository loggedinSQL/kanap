// récupérer l'identifiant du produit
let params = new URLSearchParams(window.location.search);

// paramétrer la requête avec cet identifiant
fetch("http://localhost:3000/api/products/" + params.get("id"))
    .then(res => res.json())
    .then(value => {
        // récupérer l'élément du DOM dans lequel on intégrera les éléments du produits
        const itemImg = document.querySelector(".item__img");

        // implémenter le contenu de la page en récupérant les données de l'API
        const image = document.createElement("img");
        image.src = value.imageUrl;
        image.alt = value.altTxt;
        itemImg.appendChild(image);

        const productName = document.querySelector("#title");
        productName.textContent = value.name;

        const productPrice = document.querySelector("#price");
        productPrice.textContent = value.price;

        const productDescription = document.querySelector("#description");
        productDescription.textContent = value.description;

        // générer les couleurs présentes dans le tableau colors
        for (let color of value.colors) {
            const colors = document.querySelector("#colors");
            const option = document.createElement("option");
            option.value = color;
            option.textContent = color;
            colors.appendChild(option);
        }

        document.querySelector("#addToCart").addEventListener("click", () => {
            const quantity = document.querySelector("#quantity");

            // alerter si la couleur ou la quantité n'a pas été sélectionnées
            if (colors.value === "" || quantity.value == 0) {
                alert("N'oubliez pas de choisir une couleur et une quantité.");

            } else {
                let localStorageContent = localStorage.getItem("cart");
                let data = {
                    "id": value._id,
                    "color": colors.value,
                    "quantity": quantity.value
                };

                // vérifier si un produit est présent dans le local storage
                if (localStorageContent !== undefined) {
                    let localStorageContentJSON = JSON.parse(localStorageContent) || [];
                    let productFound = false;
                    // comparer ce produit à celui qu'on souhaite enregistrer
                    for (let product of localStorageContentJSON) {
                        // si leur couleur et leur identifiant sont similaires :
                        if (product.color === data.color && product.id === data.id) {
                            // modifier uniquement la quantité du produit
                            product.quantity = parseInt(data.quantity) + parseInt(product.quantity);
                            productFound = true;
                        }
                    }
                    if (productFound == false) {
                        localStorageContentJSON.push(data);
                    }
                    localStorage.setItem("cart", JSON.stringify(localStorageContentJSON));

                } else {
                    newlocalStorage = [];
                    newlocalStorage.push(data);
                    localStorage.setItem("cart", JSON.stringify(newlocalStorage));
                }
            }
        })

    })
    .catch(err => {
        // une erreur est survenue
    })

