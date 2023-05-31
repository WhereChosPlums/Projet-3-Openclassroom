

async function fetchWorks() {
  return fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .catch(error => console.error(error));
}

function displayWorks(works) {
  const divGallery = document.querySelector(".gallery");
  divGallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i]

    const workDOM = createWorkDOM(work)
   
    divGallery.appendChild(workDOM);
  }
}

function createWorkDOM(work) {
  const figure = document.createElement("figure");
  figure.setAttribute('data-work-identifier', work.id)

  const image = document.createElement("img");
  const figcaption = document.createElement("figcaption")

  image.setAttribute('src', work.imageUrl)
  image.setAttribute('alt', work.title)

  figcaption.append(work.title)

  figure.appendChild(image)
  figure.appendChild(figcaption)

  return figure
}

function getCategories(works) {
  const categories = new Set()

  categories.add('Tous')

  for (let i = 0; i < works.length; i++) {
    const w = works[i]
    categories.add(w.category.name)
  }

  return Array.from(categories)
}

function createCategorieButton(categoryName, isActive) {
  const button = document.createElement('button')

  if(isActive) {
    button.classList.add('active')
  }

  button.classList.add('category-filter')
  button.textContent = categoryName

  return button
}

function filterWorksByType(works) {
  const btnList = document.querySelectorAll('.category-filter')

  btnList.forEach(button => {

    button.addEventListener('click', () => {
      const categoryName = button.textContent;
   
      // Filtrer les œuvres en fonction de la catégorie sélectionnée
      const filteredWorks = works.filter(work => categoryName === 'Tous' || work.category.name === categoryName);
      
      // Mettre à jour la classe active du bouton
      const activeButton = document.querySelector('.category-filter.active');
      activeButton.classList.remove('active');
      button.classList.add('active');
      displayWorks(filteredWorks);
    })

  })
}


function displayCategories(categories) {
  const categoriesDOM = document.querySelector('.category-filters')

  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i]
    const button = createCategorieButton(categoryName, i === 0)
    categoriesDOM.append(button)
  }
}



async function main() {
  works = await fetchWorks();
  displayWorks(works);
  const categories = getCategories(works)
  displayCategories(categories)
  filterWorksByType(works)
}

main();