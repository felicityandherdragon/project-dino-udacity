/**
 * All the selectors
 */
const submitButton = document.getElementById('btn');
const dinoGrid = document.getElementById('grid');
const dinoForm = document.querySelector('form');

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

/**
 * @description Dino object
 * @constructor
 * @param {Object} Object with all the raw dino data
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
}

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
    })
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
    diet: raw.diet,
    height: formattedHeight,
    weight: formattedWeight,
    name: raw.name,
  };
}

// Generate Tiles for each Dino in Array
function generateTiles() {
  console.log('TBA');
}

// Add tiles to DOM

// Remove form from screen

// Event listeners
// On form submit
dinoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const humanInfo = getHumanData(e.target);
  dinoForm.setAttribute('hidden', 'true');
  const dinos = await fetchDinos('/api/dinos');
  const speciesArray = generateSpeciesArray(dinos, humanInfo);
  console.log(speciesArray);
});
