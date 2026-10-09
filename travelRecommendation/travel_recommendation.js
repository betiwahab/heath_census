 
"use strict";

// ==========================================
// VARIABLES GLOBALES
// ==========================================

let travelData = {
    countries: [],
    temples: [],
    beaches: []
};

let dataLoaded = false;

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const results = document.getElementById("results");


// ==========================================
// VÉRIFICATION DES ÉLÉMENTS HTML
// ==========================================

if (!searchInput || !searchBtn || !resetBtn || !results) {
    console.error(
        "Erreur : vérifie les identifiants searchInput, searchBtn, resetBtn et results dans le HTML."
    );
} else {
    initializeApplication();
}


// ==========================================
// INITIALISATION
// ==========================================

function initializeApplication() {
    searchBtn.disabled = true;

    results.innerHTML = "<p>Chargement des recommandations...</p>";

    loadTravelData();

    searchBtn.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    resetBtn.addEventListener("click", resetSearch);
}


// ==========================================
// CHARGEMENT DU JSON
// ==========================================

 
async function loadTravelData() {
    const jsonPath = "travel_recommendation_api.json";
    

    console.log("URL de la page :", window.location.href);
    console.log("URL du JSON :", new URL(jsonPath, document.baseURI).href);

    try {
        const response = await fetch(jsonPath);
       // const response = await fetch("travel_recommendation_api.json");

        console.log("Statut HTTP :", response.status);
        console.log("Réponse reçue :", response);

        if (!response.ok) {
            throw new Error(
                `Erreur HTTP ${response.status} lors du chargement du JSON`
            );
        }

        const data = await response.json();

        console.log("Contenu du JSON :", data);

        travelData = {
            countries: Array.isArray(data.countries) ? data.countries : [],
            temples: Array.isArray(data.temples) ? data.temples : [],
            beaches: Array.isArray(data.beaches) ? data.beaches : []
        };

        dataLoaded = true;
        searchBtn.disabled = false;

        results.innerHTML = `
            <p>Les recommandations ont été chargées avec succès.</p>
        `;

    } catch (error) {
        console.error("Erreur détaillée :", error);

        results.innerHTML = `
            <div class="no-results">
                <h2>Erreur de chargement</h2>
                <p>${error.message}</p>
                <p>Consultez la console du navigateur pour plus de détails.</p>
            </div>
        `;
    }
}
 

 


// ==========================================
// NORMALISATION DES MOTS
// ==========================================

function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


// ==========================================
// EXTRACTION DES DESTINATIONS
// ==========================================

function getAllDestinations() {
    const destinations = [];

    // Extraction des villes des pays
    travelData.countries.forEach(country => {
        if (Array.isArray(country.cities)) {
            country.cities.forEach(city => {
                destinations.push({
                    ...city,
                    country: country.name
                });
            });
        }
    });

    // Ajout des temples
    travelData.temples.forEach(temple => {
        destinations.push(temple);
    });

    // Ajout des plages
    travelData.beaches.forEach(beach => {
        destinations.push(beach);
    });

    return destinations;
}


// ==========================================
// RECHERCHE DES RECOMMANDATIONS
// ==========================================

function performSearch() {
    if (!dataLoaded) {
        results.innerHTML = `
            <p>Veuillez patienter pendant le chargement des données.</p>
        `;
        return;
    }

    const keyword = normalizeText(searchInput.value);

    if (!keyword) {
        results.innerHTML = `
            <div class="no-results">
                <h2>Recherche vide</h2>
                <p>Veuillez saisir une destination ou une catégorie.</p>
            </div>
        `;
        return;
    }

    console.log("Mot recherché :", keyword);

    let recommendations = [];

    // Recherche des plages
    if (
        ["beach", "beaches", "plage", "plages"].includes(keyword)
    ) {
        recommendations = travelData.beaches;
    }

    // Recherche des temples
    else if (
        ["temple", "temples"].includes(keyword)
    ) {
        recommendations = travelData.temples;
    }

    // Recherche des pays et de leurs villes
    else if (
        ["country", "countries", "pays", "ville", "villes", "city", "cities"].includes(keyword)
    ) {
        recommendations = getAllDestinations();
    }

    // Recherche générale par nom ou description
    else {
        recommendations = getAllDestinations().filter(place => {
            const name = normalizeText(place.name);
            const description = normalizeText(place.description);
            const country = normalizeText(place.country);

            return (
                name.includes(keyword) ||
                description.includes(keyword) ||
                country.includes(keyword)
            );
        });
    }

    console.log("Résultats trouvés :", recommendations);

    displayRecommendations(recommendations, keyword);
}


// ==========================================
// AFFICHAGE DES RECOMMANDATIONS
// ==========================================

function displayRecommendations(recommendations, keyword) {
    results.innerHTML = "";

    if (recommendations.length === 0) {
        results.innerHTML = `
            <div class="no-results">
                <h2>Aucune recommandation trouvée</h2>
                <p>
                    Aucun résultat pour « ${escapeHTML(keyword)} ».
                </p>
                <p>
                    Essayez beach, temple, country ou le nom d'une destination.
                </p>
            </div>
        `;
        return;
    }

    recommendations.forEach(place => {
        const card = document.createElement("article");
        card.className = "recommendation-card";

        const image = document.createElement("img");

        // Compatibilité avec imageUrl ou image
        let imageUrl = place.imageUrl || place.image || "";

        // Compatibilité avec une propriété image sous forme de tableau
        if (Array.isArray(imageUrl)) {
            imageUrl = imageUrl[0] || "";
        }

        image.src = imageUrl;
        image.alt = place.name || "Destination touristique";
        image.loading = "lazy";

        image.addEventListener("error", function () {
            image.alt = "Image indisponible";
            image.classList.add("image-unavailable");
        });

        const content = document.createElement("div");
        content.className = "recommendation-content";

        const title = document.createElement("h2");
        title.textContent = place.name || "Destination sans nom";

        const description = document.createElement("p");
        description.textContent =
            place.description || "Aucune description disponible.";

        content.appendChild(title);
        content.appendChild(description);

        card.appendChild(image);
        card.appendChild(content);

        results.appendChild(card);
    });
}


// ==========================================
// PROTECTION DU HTML
// ==========================================

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// RÉINITIALISATION
// ==========================================

function resetSearch() {
    searchInput.value = "";
    results.innerHTML = "";
    searchInput.focus();
}

