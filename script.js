
const searchField = document.querySelector('.search__field');

const resultUsers = document.querySelector('.result__users');

const resultUsersSearch = document.querySelector('.result__usersSearch');

const btn = document.querySelector('.btn');

const btnClose = document.querySelector('.btnClose');

const resultTitle = document.querySelector('.result__title');

const resultStatisticsTitle = document.querySelector('.result__statisticsTitle');

const resultStatistics = document.querySelector('.result__statistics');

const resultName = document.querySelector('.resultName');

let allUsers = []
let selectedUsers = []


async function userSearch() {
  // const result = await fetch('http://localhost:3000/results')
  // const json = await result.json();
  let result = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
  let { results: json } = await result.json()
  const users = [...json]
  allUsers = users.map(user => {
    const { name, picture, dob, gender, location, phone, cell, nat } = user;
    return {
      name: name.first + ' ' + name.last,
      pictureThumb: picture.thumbnail,
      pictureLarge: picture.large,
      age: dob.age,
      gender,
      locationName: location.street.name,
      locationNumber: location.street.number,
      phone,
      cell,
      nat
    }
  })
  selectedUsers = allUsers;
}




function renderUsers() {
  resultUsersSearch.innerHTML = ''
  selectedUsers.sort((a, b) => a.name.localeCompare(b.name))

  if (selectedUsers.length !== 0) {

    selectedUsers.forEach(user => {
      const { name, pictureThumb, age } = user

      let userHTML = `
      <div class="resultName">
      <img class="imgPerson" src="${pictureThumb}">
      <div class="name">${name}, ${age} anos</div>
      </div>
      `
      resultUsersSearch.innerHTML += userHTML
    })
    resultTitle.innerHTML = `${selectedUsers.length} usuário(s) encontrados(s)`;
  }
}

function renderStatistics() {
  resultStatistics.innerHTML = ''
  resultStatistics.prepend(resultStatisticsTitle);
  let totalMaleGender = 0
  let totalFemaleGender = 0
  let sumAges = 0
  let mediaAges = 0


  if (selectedUsers.length !== 0) {

    selectedUsers.forEach(user => {
      const { gender, age } = user

      gender === 'male' ? totalMaleGender++ : totalFemaleGender++

      sumAges += age
    })

    selectedUsers.length === 0 ? mediaAges = 0 : mediaAges = sumAges / selectedUsers.length

    let usersStatusHTML = `
    <div class="result__data">
    <p>Sexo masculino: ${totalMaleGender}</p>
    <p>Sexo feminino: ${totalFemaleGender}</p>
    <p>Soma das idades: ${sumAges}</p>
    <p>Média das idades: ${mediaAges.toFixed(2)}</p>
    </div
    `
    resultStatisticsTitle.innerHTML = 'Estatísticas'
    resultStatistics.innerHTML += usersStatusHTML
  }

}

function typing(event) {
  let text = event.target.value
  selectedUsers = []

  allUsers.find(user => {
    let nameCompare = user.name.toLowerCase()

    if (text.length > 0 && text.trim() !== '' && text[0].trim() !== '') {
      btn.classList.add('active');
      searchField.classList.add('searchActive');
      btn.setAttribute('src', './lupa2.png')

      if (nameCompare.indexOf(text.toLowerCase()) >= 0) {
        selectedUsers = [...selectedUsers, user]
      }

    } else if (text.length <= 0) {
      btn.setAttribute('src', './lupa.png')
      btn.classList.remove('active')
      searchField.classList.remove('searchActive');
      resultTitle.innerHTML = 'Nenhum usuário filtrado';
      resultStatisticsTitle.innerHTML = 'Nada a ser exibido';
    }
  })
  renderUsers()
  renderStatistics()
}

function renderSelectPerson(event) {
  let alvo = event.target;

  function renderDataPerson(fullName) {
    selectedUsers.forEach(user => {
      const { name, pictureLarge, age, gender, locationName, locationNumber, phone, cell, nat } = user;

      if (fullName.includes(name)) {

        return resultStatistics.innerHTML =
          `
          <h2 class="result__statisticsTitle">Usuário(a) Selecionado(a) </h2>
          <div class="resultName">
          <button class="btnClose">X</button>
            <div class="personData">
            <img src="${pictureLarge}"/>
            <p>Nome: ${name}</p>
            <p> Idade: ${age} anos</p>
            <p>Sexo: ${gender}</p>
            <p>Endereço: ${locationName} ${locationNumber}</p>
            <p>Contato: ${phone} / ${cell}</p>
            <p>Nacionalidade: ${nat}</p>
              </div>
              </div>`;
      }

    })

  }

  if (alvo.classList.contains('name')) {
    renderDataPerson(alvo.innerHTML)
  }
  else if (alvo.classList.contains('resultName')) {
    renderDataPerson(alvo.lastElementChild.innerHTML)
  }
  else if (alvo.classList.contains('imgPerson')) {
    renderDataPerson(alvo.nextElementSibling.innerHTML)
  }
}

function closeResult(event) {
  if (event.target.classList.contains('btnClose')) {
    resultTitle.innerHTML = 'Nenhum usuário filtrado';
    resultStatistics.innerHTML = `<h2 class="result__statisticsTitle">Nada a ser exibido</h2>`
    resultUsersSearch.innerHTML = '';
    searchField.classList.remove('searchActive');
    searchField.value = ''
    btn.setAttribute('src', './lupa.png')
  }
}


resultUsersSearch.addEventListener('click', renderSelectPerson);
searchField.addEventListener('keyup', typing);
searchField.focus();
btn.addEventListener('click', typing);
resultStatistics.addEventListener('click', closeResult)
window.addEventListener('load', userSearch);

