document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = 'http://localhost:3000/dogs'
  const tableBody = document.getElementById('table-body')
  const dogForm = document.getElementById('dog-form')
  let selectedDogId = null

  function fetchDogs() {
    fetch(baseUrl)
      .then(response => response.json())
      .then(dogs => {
        renderDogs(dogs)
      })
  }

  function renderDogs(dogs) {
    tableBody.innerHTML = ''
    dogs.forEach(dog => {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button data-id="${dog.id}" class="edit-button">Edit</button></td>
      `
      tableBody.appendChild(tr)
    })
  }

  function populateForm(dog) {
    dogForm.name.value = dog.name
    dogForm.breed.value = dog.breed
    dogForm.sex.value = dog.sex
    selectedDogId = dog.id
  }

  function updateDog(event) {
    event.preventDefault()
    if (selectedDogId) {
      const updatedDog = {
        name: dogForm.name.value,
        breed: dogForm.breed.value,
        sex: dogForm.sex.value
      }
      fetch(`${baseUrl}/${selectedDogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDog),
      })
        .then(response => response.json())
        .then(() => {
          // Refetches dog list
          fetchDogs()
          dogForm.reset()
          selectedDogId = null
        })
    }
  }

  tableBody.addEventListener('click', event => {
    if (event.target.classList.contains('edit-button')) {
      const dogId = event.target.dataset.id
      fetch(`${baseUrl}/${dogId}`)
        .then(response => response.json())
        .then(dog => {
          populateForm(dog)
        })
    }
  })

  dogForm.addEventListener('submit', updateDog)

  fetchDogs()
})