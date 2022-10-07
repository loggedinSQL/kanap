// récupérer le contenu du localStorage
let localStorageItems = JSON.parse(localStorage.getItem("cart"));

let totalQuantity = 0;
let totalPrice = 0;

for (let data of localStorageItems) {

    fetch(`http://localhost:3000/api/products/${data.id}`)
        .then(res => res.json())
        .then(value => {
            // récupérer l'élément du DOM dans lequel on intégrera la fiche produit
            const sectionCartItems = document.getElementById("cart__items");


            // créer le contenu de la fiche produit en récupérant les données dans l'API ou le localstorage
            let article = document.createElement("article");
            article.classList.add("cart__item");
            article.dataset.id = data.id;
            article.dataset.color = data.color;
            sectionCartItems.appendChild(article);

            let divImage = document.createElement("div");
            divImage.classList.add("cart__item__img");
            article.appendChild(divImage);

            divImage.appendChild(createImage(value));



            let divContent = document.createElement("div");
            divContent.classList.add("cart__item__content");
            article.appendChild(divContent);

            let divContentDescription = document.createElement("div");
            divContentDescription.classList.add("cart__item__content__description");
            divContent.appendChild(divContentDescription);

            divContentDescription.appendChild(createName(value));
            divContentDescription.appendChild(createColor(data));
            divContentDescription.appendChild(createPrice(value));



            let divContentSettings = document.createElement("div");
            divContentSettings.classList.add("cart__item__content__settings");
            divContent.appendChild(divContentSettings);

            let divContentSettingsQuantity = document.createElement("div");
            divContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");
            divContentSettings.appendChild(divContentSettingsQuantity);

            divContentSettingsQuantity.appendChild(createQuantityElement());
            divContentSettingsQuantity.appendChild(changeQuantity(data));



            let divContentSettingsDelete = document.createElement("div");
            divContentSettingsDelete.classList.add("cart__item__content__settings__delete");
            divContentSettings.appendChild(divContentSettingsDelete);

            divContentSettingsDelete.appendChild(removeFromCart(data));



            // afficher la quantité totale et le tarif total du panier
            totalQuantity += parseInt(data.quantity);
            document.getElementById("totalQuantity").textContent = totalQuantity;

            totalPrice += value.price * data.quantity;
            document.getElementById("totalPrice").textContent = totalPrice;



            // cliquer sur le bouton pour valider la commande
            document.querySelector('form input[type="submit"]').addEventListener("click", (event) => {
                event.preventDefault();

                // vérifier 
                if (localStorageItems === undefined) {
                    alert("Veuillez rajouter un produit au panier avant de passer commande");

                } else {
                    let firstName = document.querySelector("#firstName").value;
                    let lastName = document.querySelector("#lastName").value;
                    let address = document.querySelector("#address").value;
                    let city = document.querySelector("#city").value;
                    let email = document.querySelector("#email").value;

                    if (firstName === "" || lastName === "" || address === "" || city === "" || email === "") {
                        alert("Veuillez remplir tous les champs du formulaire avant de cliquer.");

                    } else {

                        let regName = /^[A-Z][A-Za-z\éèïîàç\'-]+[A-Za-z\éèïîàç]+$/;
                        let regAddress = /^[A-Z0-9 -'][A-Za-z\éèïîàç\0-9]+$/
                        let regEmail = /^[a-zA-Z0-9_.-]+\@+[a-zA-Z0-9]+\.+[a-z]{2,4}$/;

                        let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
                        let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
                        let addressErrorMsg = document.querySelector("#addressErrorMsg");
                        let cityErrorMsg = document.querySelector("#cityErrorMsg");
                        let emailErrorMsg = document.querySelector("#emailErrorMsg");

                        let isValid = true;


                        if (!regName.test(firstName)) {
                            firstNameErrorMsg.textContent = "Veuillez ressaisir votre prénom";
                            isValid = false;
                        } else {
                            firstNameErrorMsg.textContent = "";
                        }


                        if (!regName.test(lastName)) {
                            lastNameErrorMsg.textContent = "Veuillez ressaisir votre nom de famille";
                            isValid = false;
                        } else {
                            lastNameErrorMsg.textContent = "";
                        }


                        if (!regAddress.test(address)) {
                            addressErrorMsg.textContent = "Veuillez ressaisir votre adresse";
                            isValid = false;
                        } else {
                            addressErrorMsg.textContent = "";
                        }


                        if (!regAddress.test(city)) {
                            cityErrorMsg.textContent = "Veuillez ressaisir le nom de votre ville";
                            isValid = false;
                        } else {
                            cityErrorMsg.textContent = "";
                        }


                        if (!regEmail.test(email)) {
                            emailErrorMsg.textContent = "Veuillez ressaisir votre email";
                            isValid = false;
                        } else {
                            emailErrorMsg.textContent = "";
                        }


                        if (isValid) {
                            let products = JSON.parse(localStorage.getItem("cart"));
                            let productsId = [];

                            for (item of products) {
                                productsId.push(item.id);
                            }

                            let order = {
                                contact: {
                                    "firstName": firstName,
                                    "lastName": lastName,
                                    "address": address,
                                    "city": city,
                                    "email": email
                                },
                                products: productsId
                            }

                            postRequest(order);
                        }
                    }
                }
            })

        })
        .catch(err => {
            err.status(400).json({ message: 'une erreur est survenue' });
        })
}


// créer l'élément image (img) de la fiche produit
const createImage = (product) => {
    let image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = product.altTxt;

    return image;
}


// créer l'élément name (h2) de la fiche produit
const createName = (product) => {
    let name = document.createElement("h2");
    name.textContent = product.name;

    return name;
}


// créer l'élément color (p) de la fiche produit
const createColor = (product) => {
    let color = document.createElement("p");
    color.textContent = product.color;

    return color
}


// créer l'élément prix (p) de la fiche produit
const createPrice = (product) => {
    let price = document.createElement("p");
    price.textContent = product.price + "€";

    return price;
}


// créer l'élément quantité (p) de la fiche produit
const createQuantityElement = () => {
    let quantity = document.createElement("p");
    quantity.textContent = "Qté :";

    return quantity;
}


// créer un input qui modifiera la quantité du produit dans le panier
const changeQuantity = (product) => {
    let input = document.createElement("input");
    input.classList.add("itemQuantity");
    input.type = "number";
    input.name = "itemQuantity";
    input.min = 1;
    input.max = 100;
    input.value = product.quantity;

    input.addEventListener("change", (event) => {
        product.quantity = parseInt(event.target.value);
        localStorage.setItem("cart", JSON.stringify(localStorageItems));
        window.location.reload();
    })

    return input;
}


// ajout d'une fonction qui supprime le produit du panier
const removeFromCart = () => {
    let deleteItem = document.createElement("p");
    deleteItem.classList.add("deleteItem");
    deleteItem.textContent = "Supprimer";

    deleteItem.addEventListener('click', (e) => {
        let deleteButtons = document.getElementsByClassName("deleteItem");
        let cartStorage = JSON.parse(localStorage.getItem("cart"))

        for (let i = 0; i < deleteButtons.length; i++) {
            let productToBeRemoved = e.target.closest("article");
            productToBeRemoved.remove();

            let productToBeRemovedId = productToBeRemoved.dataset.id;
            let productToBeRemovedColor = productToBeRemoved.dataset.color;
            let removedFromCart = cartStorage.filter((item) => item.id !== productToBeRemovedId || item.color !== productToBeRemovedColor);

            cartStorage = removedFromCart;
            localStorage.setItem("cart", JSON.stringify(cartStorage));
            window.location.reload();
        }
    })

    return deleteItem;
}


// envoyer une requête POSt et récupérer le numéro de commande (orderId)
const postRequest = (order) => {
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then(res => res.json())
        .then(value => {
            // vider le localstorage et configurer la redirection avec le numéro de commande
            localStorage.clear();
            window.location.assign("confirmation.html?orderId=" + value.orderId);
        })
        .catch(err => {
            err.status(400).json({ message: 'une erreur est survenue' });
        })
}

