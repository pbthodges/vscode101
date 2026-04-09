document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('recipe-list');
    const recipeNameInput = document.getElementById('recipe-name');
    const recipeDescriptionInput = document.getElementById('recipe-description');

    /** @type {Pecipe[]} */
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    // Migrate old recipes
    recipes = recipes.map(recipe => ({
        id: recipe.id || Date.now() + Math.random(),
        name: recipe.name,
        description: recipe.description,
        favorite: recipe.favorite || false
    }));

    // Sample recipes
    const sampleRecipes = [
        { id: 1, name: 'Spaghetti Carbonara', description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.', favorite: false },
        { id: 2, name: 'Chicken Curry', description: 'A flavorful Indian dish with tender chicken in a rich, spiced sauce.', favorite: false },
        { id: 3, name: 'Chocolate Chip Cookies', description: 'Soft and chewy cookies loaded with chocolate chips and vanilla.', favorite: false }
    ];
    
    // Add sample recipes if none exist
    if (recipes.length === 0) {
        recipes = [...sampleRecipes];
        saveRecipes();
    }
    

    function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function renderRecipes() {
        recipeList.innerHTML = '';
        // Sort recipes: favorites first
        const sortedRecipes = recipes.sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return a.id - b.id;
        });
        sortedRecipes.forEach((recipe) => {
            const li = document.createElement('li');
            li.className = 'recipe-item';
            li.innerHTML = `
                <div class="recipe-content">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                </div>
                <div class="buttons">
                    <button class="favorite-btn${recipe.favorite ? ' solid' : ''}" data-id="${recipe.id}">${recipe.favorite ? '★' : '☆'}</button>
                    <button class="delete-btn" data-id="${recipe.id}">Delete</button>
                </div>
            `;
            recipeList.appendChild(li);
        });
    }

    function addRecipe(name, description) {
        const id = Date.now();
        recipes.push({ id, name, description, favorite: false });
        saveRecipes();
        renderRecipes();
    }

    function toggleFavorite(id) {
        const recipe = recipes.find(r => r.id === id);
        if (recipe) {
            recipe.favorite = !recipe.favorite;
            saveRecipes();
            renderRecipes();
        }
    }

    function deleteRecipe(id) {
        recipes = recipes.filter(recipe => recipe.id !== id);
        saveRecipes();
        renderRecipes();
    }

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = recipeNameInput.value.trim();
        const description = recipeDescriptionInput.value.trim();
        if (name && description) {
            addRecipe(name, description);
            recipeNameInput.value = '';
            recipeDescriptionInput.value = '';
        }
    });

    recipeList.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (e.target.classList.contains('delete-btn')) {
            deleteRecipe(id);
        } else if (e.target.classList.contains('favorite-btn')) {
            toggleFavorite(id);
        }
    });

    renderRecipes();
});