/* =========================================================
   CHROMA ESPORT — PARTNERS SCREEN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
     * Vérification des logos
     *
     * Si un fichier logo est absent, la carte reste visible
     * et affiche simplement le nom du partenaire.
     */

    const logos = document.querySelectorAll(".logo-container img");

    logos.forEach((logo) => {

        logo.addEventListener("error", () => {

            logo.style.display = "none";

            const container = logo.parentElement;

            container.classList.add("logo-missing");

        });

    });


    /*
     * Petite interaction souris
     *
     * L'effet reste volontairement très léger afin de
     * conserver un rendu propre sur un overlay Twitch.
     */

    const cards = document.querySelectorAll(".partner-card");

    cards.forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect = card.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) / rect.width - 0.5;

            const y =
                (event.clientY - rect.top) / rect.height - 0.5;

            card.style.transform =
                `translateY(-7px)
                 rotateX(${y * -2}deg)
                 rotateY(${x * 2}deg)`;

        });


        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

});
