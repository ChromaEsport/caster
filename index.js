const categoryButtons = document.querySelectorAll(".category-btn");


categoryButtons.forEach(button => {


    button.addEventListener("click", () => {


        const currentCategory = button.parentElement;


        // Vérifie si la catégorie cliquée est déjà ouverte

        const isOpen = currentCategory.classList.contains("active");


        // Ferme toutes les catégories

        document.querySelectorAll(".category").forEach(category => {

            category.classList.remove("active");

        });


        // Ouvre uniquement la catégorie cliquée
        // si elle était fermée

        if (!isOpen) {

            currentCategory.classList.add("active");

        }


    });


});
