
let travelData = {};

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const results = document.getElementById("results");


// ==========================================
// CHARGEMENT DU JSON
// ==========================================

fetch("travel_recommendation_api.json")
    .then(response => {

        console.log("Réponse du serveur :", response);

        if (!response.ok) {
            throw new Error("Le fichier JSON n'a pas été trouvé");
        }

        return response.json();
    })

    .then(data => {

        console.log("JSON chargé :", data);

        travelData = data;

        console.log("Countries :", travelData.countries);
        console.log("Temples :", travelData.temples);
        console.log("Beaches :", travelData.beaches);

    })

    .catch(error => {

        console.error("ERREUR :", error);

    });


// ==========================================
// RECHERCHE
// ==========================================

searchBtn.addEventListener("click", function () {

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    console.log("Mot recherché :", keyword);

    console.log("Données disponibles :", travelData);


    let recommendations = [];


    // BEACH
    if (
        keyword === "beach" ||
        keyword === "beaches"
    ) {

        recommendations = travelData.beaches || [];

    }


    // TEMPLE
    else if (
        keyword === "temple" ||
        keyword === "temples"
    ) {

        recommendations = travelData.temples || [];

    }


    // COUNTRY
    else if (
        keyword === "country" ||
        keyword === "countries"
    ) {

        if (travelData.countries) {

            travelData.countries.forEach(country => {

                country.cities.forEach(city => {

                    recommendations.push(city);

                });

            });

        }

    }


    console.log(
        "Recommandations trouvées :",
        recommendations
    );


    // ==========================================
    // AFFICHAGE
    // ==========================================

    results.innerHTML = "";


    if (recommendations.length === 0) {

        results.innerHTML = `
            <div class="no-results">

                <h2>Aucune recommandation</h2>

                <p>
                    Mot recherché :
                    ${keyword}
                </p>

            </div>
        `;

        return;
    }


    recommendations.forEach(place => {

        const card = document.createElement("div");

        card.className = "recommendation-card";

        card.innerHTML = `

            <img
                src="${place.imageUrl}"
                alt="${place.name}"
            >

            <div class="recommendation-content">

                <h2>${place.name}</h2>

                <p>${place.description}</p>

            </div>

        `;

        results.appendChild(card);

    });

});


// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener("click", function () {

    searchInput.value = "";

    results.innerHTML = "";

});

