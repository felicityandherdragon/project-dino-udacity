/**
 * All the selectors
 */
// const submitButton = document.getElementById('btn');
const dinoGrid = document.getElementById('grid');
const dinoForm = document.querySelector('form');

/**
 * @description Dino constructor
 * @constructor
 * @param {Object} dino object with all the raw dino data
 */
function dinoConstructor(dino) {
  this.species = dino.species;
  this.weight = dino.weight;
  this.height = dino.height;
  this.diet = dino.diet;
  this.where = dino.where;
  this.when = dino.when;
  this.fact = dino.fact;
}

/* Compare weight method*/
dinoConstructor.prototype.compareWeight = function (humanWeight) {
  const ratio = (this.weight / humanWeight).toFixed(1);
  if (ratio > 1) {
    return `${this.species} is ${Math.floor(ratio)} times your weight`;
  } else if (ratio < 1) {
    return `Your weight is ${(humanWeight / this.weight).toFixed(
      1
    )} times the weight of ${this.species}`;
  } else {
    return `${this.species} is the same weight as you`;
  }
};

/* Compare height method*/
dinoConstructor.prototype.compareHeight = function (humanHeight) {
  const ratio = (this.height / humanHeight).toFixed(1);
  if (ratio > 1) {
    return `${this.species} is ${Math.floor(ratio)} times your height`;
  } else if (ratio < 1) {
    return `Your height is ${(humanHeight / this.height).toFixed(
      1
    )} times the height of ${this.species}`;
  } else {
    return `${this.species} is the same height as you`;
  }
};

/* Compare diet method*/
dinoConstructor.prototype.compareDiet = function (humanDiet) {
  if (this.diet === humanDiet) {
    return `${this.species} enjoys the same diet as you!`;
  } else {
    return `${this.species} was ${this.diet}, and you were ${humanDiet}`;
  }
};

/**
 * @description create array with dino objects and human object in the right order
 * @param {array} dinoData array with all the single dino objects with raw info
 * @param {object} humanObj object with the human object
 * @returns array with dino and human objects
 */
function generateSpeciesArray(dinoData, humanObj) {
  const combinedArray = [];
  dinoData.forEach((eachDino) => {
    const currDino = new dinoConstructor(eachDino);
    combinedArray.push(currDino);
  });
  combinedArray.splice(4, 0, humanObj);
  return combinedArray;
}

/**
 * @description get human data from the form
 * @returns human object based on user input
 */
function getHumanData(formData) {
  const raw = Object.fromEntries(new FormData(formData).entries());
  const formattedHeight = Number(raw.feet) * 12 + Number(raw.inches);
  const formattedWeight = Number(raw.weight);

  return {
    species: 'human',
    diet: raw.diet,
    height: formattedHeight,
    weight: formattedWeight,
    name: raw.name,
  };
}


function generateRandomFact(dino, human) {
  let randomizedFact;
  const randomNumber =
    dino.species === 'Pigeon' ? 4 : Math.round(Math.random() * 6);

  switch (randomNumber) {
    case 1:
      randomizedFact = dino.compareHeight(human.height);
      break;
    case 2:
      randomizedFact = dino.compareWeight(human.weight);
      break;
    case 3:
      randomizedFact = dino.compareDiet(human.diet);
      break;
    case 4:
      randomizedFact = dino.fact;
      break;
    case 5:
      randomizedFact = `${dino.species} lived in the ${dino.where} area!`;
      break;
    case 6:
      randomizedFact = `${dino.species} lived in the ${dino.when} era!`;
      break;
    default:
      randomizedFact = 'Hmmm I am running out of dinosaur facts here ;p';
  }

  return randomizedFact;
}

/**
 * @description generate the individual dino tile with dino data
 * @param {object} dino a single dino object
 * @returns the tile element for a single dino
 */
function generateDinoTile(dino, human) {
  let fact = generateRandomFact(dino, human);

  const tileDiv = document.createElement('div');
  tileDiv.classList.add('grid-item');
  tileDiv.id = dino.species;
  // TODO: might want to remove this event listener
  tileDiv.addEventListener('click', refreshFact);

  const tileHeader = document.createElement('h3');
  tileHeader.textContent = dino.species;
  const tileImage = document.createElement('img');
  tileImage.src = `./images/${dino.species.toLowerCase()}.png`;
  const tileFact = document.createElement('p');
  tileFact.textContent = fact;

  tileDiv.append(tileHeader, tileImage, tileFact);

  return tileDiv;
}

/**
 * @description generate the human tile
 * @param {object} human a single human object
 * @returns the human tile element
 */
function generateHumanTile(human) {
  const tileDiv = document.createElement('div');
  tileDiv.classList.add('grid-item');

  const tileHeader = document.createElement('h3');
  tileHeader.textContent = human.name;
  const tileImage = document.createElement('img');
  tileImage.src = './images/human.png';

  tileDiv.append(tileHeader, tileImage);

  return tileDiv;
}

/**
 * @description generate the grid with tiles and attach it to the DOM
 * @param {array} speciesArray that includes dino object and human object
 */
function generateGrid(speciesArray) {
  const gridFragment = document.createDocumentFragment();
  speciesArray.forEach((obj, idx) => {
    let currTile;
    if (idx === 4) {
      currTile = generateHumanTile(obj);
    } else {
      currTile = generateDinoTile(obj, speciesArray[4]);
    }
    gridFragment.append(currTile);
  });
  dinoGrid.append(gridFragment);
}

/**
 * @description fetch raw dino data from .json file
 * @param {string} the api endpoint to fetch raw dino data
 * @returns raw dino data
 */
async function fetchDinos(url) {
  try {
    const res = await fetch(url);
    const { Dinos } = await res.json();
    return Dinos;
  } catch (err) {
    console.log(err);
  }
}

/* function to handle data fetching and UI update */
function showGrid(dinos, humanInfo) {
  dinoForm.setAttribute('hidden', 'true');
  const speciesArray = generateSpeciesArray(dinos, humanInfo);
  generateGrid(speciesArray);
}

async function windowLoaded(e) {
  if (localStorage?.getItem('humanInfo')) {
    const humanInfo = JSON.parse(localStorage.getItem('humanInfo'));
    const dinos = JSON.parse(localStorage.getItem('dinos'));
    showGrid(dinos, humanInfo);
  } else {
    return;
  }
}

async function gatherData(e) {
  e.preventDefault();
  const humanInfo = getHumanData(e.target);
  localStorage.setItem('humanInfo', JSON.stringify(humanInfo));
  const dinos = await fetchDinos('/api/dinos');
  localStorage.setItem('dinos', JSON.stringify(dinos));
  return {humanInfo, dinos};
}

async function formSubmitted(e) {
  const { humanInfo, dinos } = await gatherData(e);
  showGrid(dinos, humanInfo);
}

// TODO: unfinished
function refreshFact() {
  const tileToRefresh = document.getElementById(this.id);
  const tileFactToRefresh = tileToRefresh.querySelector('p');
  const humanInfo = JSON.parse(localStorage.getItem('humanInfo'));
  const dinos = JSON.parse(localStorage.getItem('dinos'));
  const dino = new dinoConstructor(dinos.find(each => each.species === this.id));
  let newFact = generateRandomFact(dino, humanInfo)
  tileFactToRefresh.textContent = newFact;
}

/* event listener on form submit */
dinoForm.addEventListener('submit', formSubmitted);
// NOTE: might still want to use this
// dinoGrid.addEventListener('click', refreshFact);
//TODO: use this coupled with local storage / cookie to persist the graph?
window.addEventListener('load', windowLoaded);
