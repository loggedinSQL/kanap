// récupérer l'identifiant du produit
let params = new URLSearchParams(window.location.search);

// paramétrer la requête avec cet identifiant
fetch("http://localhost:3000/api/products/" + params.get("id"))
    .then(res => res.json())
    .then(value => {
        // récupérer l'élément du DOM dans lequel on intégrera les éléments du produits
        const itemImg = document.querySelector(".item__img");

        itemImg.appendChild(createImage(value));
        
        showItemInfo(value);

        // ajouter un menu déroulant qui permet de personnaliser le produit
        for (let color of value.colors) {
            const colors = document.querySelector("#colors");
            colors.appendChild(createOption(color));
        }


        // enregistrer le produit en cliquant sur ajouter au panier 
        document.querySelector("#addToCart").addEventListener("click", () => {
            const quantity = document.querySelector("#quantity");

            // alerter l'utilisateur si la couleur ou la quantité n'a pas été sélectionnée
            if (colors.value === "" || quantity.value == 0) {
                alert("N'oubliez pas de choisir une couleur et une quantité.");

            } else {
                let localStorageContent = localStorage.getItem("cart");
                let data = {
                    "id": value._id,
                    "color": colors.value,
                    "quantity": quantity.value
                };

                // vérifier si un produit a déjà été enregistrer dans le local storage
                if (localStorageContent !== undefined) {
                    let localStorageContentJSON = JSON.parse(localStorageContent) || [];
                    let productFound = false;
                    
                    // modifier la quantité en cas de similarité entre les produits
                    for (let product of localStorageContentJSON) {
                            if (product.color === data.color && product.id === data.id) {
                            product.quantity = parseInt(data.quantity) + parseInt(product.quantity);
                            productFound = true;
                        }
                    }

                    if (productFound == false) {
                        localStorageContentJSON.push(data);
                    }

                    localStorage.setItem("cart", JSON.stringify(localStorageContentJSON));
                    alert("Le produit a bien été ajouté au panier.")

                } else {
                    newlocalStorage = [];
                    newlocalStorage.push(data);
                    localStorage.setItem("cart", JSON.stringify(newlocalStorage));
                    alert("Le produit a bien été ajouté au panier.")
                }
            }
        })

    })
    .catch(err => {
        err.status(400).json({ message: 'une erreur est survenue' });
    })


    // créer l'élément image de la page produit
    const createImage = (item) => {
        const image = document.createElement("img");
        image.src = item.imageUrl;
        image.alt = item.altTxt;
    
        return image;
    }


    // ajouter les informations de l'article à la page
    const showItemInfo = (item) => {
        const productName = document.querySelector("#title");
        productName.textContent = item.name;

        const productPrice = document.querySelector("#price");
        productPrice.textContent = item.price;

        const productDescription = document.querySelector("#description");
        productDescription.textContent = item.description;
    }


    // créer les options de couleur du menu déroulant
    const createOption = (colors) => {
        const option = document.createElement("option");
        option.value = colors;
        option.textContent = colors;

        return option;
    }

