let modal = null

const openModal = function (e) {
  e.preventDefault()
  e.stopPropagation()
  modal = document.querySelector(e.target.getAttribute('href'))
  modal.style.display = null
  modal.removeAttribute('aria-hidden')
  modal.setAttribute('aria-modal', 'true')
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
}

const closeModal = function () {
  if (modal === null) return
  modal.style.display = 'none'
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')

  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal = null
}

const closeModalWhenClickOutside = function () {
  document.addEventListener('click', (event) => {
    if (modal != null) {
      if (!event.target.closest('.modal-wrapper')) {
        closeModal()
      }
    }
  })
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelector('.edit_button').addEventListener('click', openModal)

function displayGallery(works) {
  const modalWrapper = document.querySelector('.gallery-wrapper')
  const gallery = document.createElement('div')
  gallery.setAttribute('class', 'modal-gallery')

  for (const work of works) {
    const galleryItem = createGalleryItem(work)
    gallery.appendChild(galleryItem)
  }

  modalWrapper.appendChild(gallery)
}

function createGalleryItem(work) {
  const galleryItem = document.createElement('div')
  galleryItem.setAttribute('class', 'gallery-item')
  galleryItem.setAttribute('data-work-identifier', work.id)

  const img = document.createElement('img')
  img.setAttribute('src', work.imageUrl)

  const text = document.createElement('p')
  text.textContent = "éditer";

  const trashBtn = document.createElement('button')
  trashBtn.classList.add('delete-btn')

  const trashIcon = document.createElement('i')
  trashIcon.setAttribute('class', 'fa fa-trash')
  trashBtn.appendChild(trashIcon)
  galleryItem.appendChild(img)
  galleryItem.appendChild(trashBtn)
  galleryItem.appendChild(text)

  return galleryItem
}


function handleDeleteWork() {
  const deleteBtns = document.querySelectorAll('.delete-btn')

  for (const deleteBtn of deleteBtns) {
    deleteBtn.addEventListener('click', async () => {
      const galleryItem = deleteBtn.closest('.gallery-item')
      const workIdentifier = galleryItem.dataset.workIdentifier
      const figure = document.querySelector(`figure[data-work-identifier="${workIdentifier}"]`)


      const token = sessionStorage.getItem("token");

      const response = await fetch(`http://localhost:5678/api/works/${workIdentifier}`, {
        method: 'DELETE',
        headers: { "Content-type": "application/json", "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        galleryItem.remove()
        figure.remove()
      } else
        console.error(`Erreur lors de la suppression du travail avec l'id ${imgId}`);
    })
  }
}


const newWorkBtn = document.querySelector('.ajout-photo')

newWorkBtn.addEventListener('click', function () {
  document.querySelector('.first-modal').classList.add('hidden')
  document.querySelector('#NewForm').classList.remove('hidden')
})


const categorySelect = document.querySelector('#categories-selection');
let selectedCategoryId;

async function fetchCategories() {
  return fetch(`http://localhost:5678/api/categories`)
    .then(res => res.json())
    .then(data =>  data
    ).catch(err => console.log(err))
}

function fillDropdownCategories(categorieList) {
  const categorySelect = document.querySelector("#categories-selection");
  categorieList.forEach(categorie => {
    const option = document.createElement('option');
    option.value = categorie.id; 
    option.text = categorie.name; 
    categorySelect.appendChild(option);
  });
}


// fleche arriere//
// Logique de la flèche pour revenir en arrière
const retour = document.querySelector('.fa-arrow-left')

retour.addEventListener('click', () => {
  document.querySelector('#NewForm').classList.add('hidden')
  document.querySelector('.first-modal').classList.remove('hidden')
})


/** fonction preview */

function showPreview(event) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const previewImage = document.querySelector(".svgimage");
      previewImage.setAttribute("src", reader.result);
      previewImage.style.display = "block";
    });

    reader.readAsDataURL(event.target.files[0]);
  }
}


// Fonction pour gérer le clic sur le bouton //
async function handleButtonClick(event) {
  event.preventDefault()
  const token = sessionStorage.getItem("token");
  const fileTitle = document.querySelector("#file-title").value;
  const selectedCategory = document.querySelector("#categories-selection").value;

  const formData = new FormData();
  formData.append("title", fileTitle);
  formData.append("category", selectedCategory);
  formData.append("image", document.querySelector("#image-upload").files[0]);


  try {
    const response = await fetch('http://localhost:5678/api/works/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log("API response:", data);
    } else {
      console.log("API fail:", response.status, response.statusText);
    }
  } catch (error) {
    console.log("API fail:", error);
  }
}

// Ajout de l'événement click au bouton
document.querySelector(".valider-photo").addEventListener("click", handleButtonClick);


function saveFile() {

  const fileTitle = document.querySelector("#file-title").value;
  const selectedCategory = document.querySelector("#categories-selection").value;

  const formData = new FormData();
  formData.append("title", fileTitle);
  formData.append("category", selectedCategory);
  formData.append("file", document.querySelector("#image-upload").files[0]);
  
  try {
 
  } catch (error) {
    console.log("API fail:", error);
  }
}









async function mainAdmin() {
  works = await fetchWorks();
  displayWorks(works);
  displayGallery(works)
  handleDeleteWork()
  closeModalWhenClickOutside()
  const categories = await fetchCategories()
  fillDropdownCategories(categories)

  
}

mainAdmin();
