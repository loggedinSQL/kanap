// récupérer le numéro de commande de l'url et l'afficher dans le DOM
let urlParams = new URLSearchParams(window.location.search);

let orderId = document.querySelector("#orderId");
orderId.textContent = urlParams.get("orderId");

