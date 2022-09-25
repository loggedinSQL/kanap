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

            let image = document.createElement("img");
            image.src = value.imageUrl;
            image.alt = value.altTxt;
            divImage.appendChild(image);


            let divContent = document.createElement("div");
            divContent.classList.add("cart__item__content");
            article.appendChild(divContent);

            let divContentDescription = document.createElement("div");
            divContentDescription.classList.add("cart__item__content__description");
            divContent.appendChild(divContentDescription);

            let name = document.createElement("h2");
            name.textContent = value.name;
            divContentDescription.appendChild(name);

            let color = document.createElement("p");
            color.textContent = data.color;
            divContentDescription.appendChild(color);

            let price = document.createElement("p");
            price.textContent = value.price + "€";
            divContentDescription.appendChild(price);


            let divContentSettings = document.createElement("div");
            divContentSettings.classList.add("cart__item__content__settings");
            divContent.appendChild(divContentSettings);

            let divContentSettingsQuantity = document.createElement("div");
            divContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");
            divContentSettings.appendChild(divContentSettingsQuantity);

            let quantity = document.createElement("p");
            quantity.textContent = "Qté :";
            divContentSettingsQuantity.appendChild(quantity);

            let input = document.createElement("input");
            input.classList.add("itemQuantity");
            input.type = "number";
            input.name = "itemQuantity";
            input.min = 1;
            input.max = 100;
            input.value = data.quantity;
            divContentSettingsQuantity.appendChild(input);

            // modifier la quantité du produit dans le storage et enregistrer la
            input.addEventListener("change", (event) => {
                data.quantity = parseInt(event.target.value);
                localStorage.setItem("cart", JSON.stringify(localStorageItems));
                window.location.reload();
            })
            

            let divContentSettingsDelete = document.createElement("div");
            divContentSettingsDelete.classList.add("cart__item__content__settings__delete");
            divContentSettings.appendChild(divContentSettingsDelete);

            let deleteItem = document.createElement("p");
            deleteItem.classList.add("deleteItem");
            deleteItem.textContent = "Supprimer";
            divContentSettingsDelete.appendChild(deleteItem);

            // supprimer le produit du localstorage
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


            // afficher la quantité totale et le tarif total du panier
            totalQuantity += parseInt(data.quantity);
            totalPrice += value.price * data.quantity;
            document.getElementById("totalQuantity").textContent = totalQuantity;
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

                        if (!regName.test(firstName)) {

                            firstNameErrorMsg.textContent = "Veuillez ressaisir votre prénom";

                        } else if (!regName.test(lastName)) {

                            lastNameErrorMsg.textContent = "Veuillez ressaisir votre nom de famille";

                        } else if (!regAddress.test(address)) {

                            addressErrorMsg.textContent = "Veuillez ressaisir votre adresse";

                        } else if (!regAddress.test(city)) {

                            cityErrorMsg.textContent = "Veuillez ressaisir le nom de votre ville";

                        } else if (!regEmail.test(email)) {

                            emailErrorMsg.textContent = "Veuillez ressaisir votre email";

                        } else {
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
                                    // vider le localstorage
                                    localStorage.clear();
                                    // configurer la redirection avec le numéro de commande
                                    window.location.assign("confirmation.html?orderId=" + value.orderId);
                                })
                                .catch(err => {
                                    // une erreur est survenue
                                })
                        }
                    }
                }
            })

        })
        .catch(err => {
            // une erreur est survenue
        })
}

