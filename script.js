/*
CANVAS SECTION /////////////////////////////////////////////
*/

const checkboxes = document.querySelector('#checkboxes');
let checkboxArray = [
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,
    0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,
    0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,
    0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,
    0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,
    0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,
    0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,
    0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
]
//15 cols

const checkboxEles = checkboxArray.map(checkbox => `<input type="checkbox" ${checkbox === 1 ? 'checked' : ''}/>`).join('')
checkboxes.innerHTML = checkboxEles;

function invertCheckboxes() {
    for (i=0; i<checkboxArray.length; i++)
    {
        checkboxArray[i] === 0 ? checkboxArray[i] = 1 : checkboxArray[i] = 0
    }
    const checkboxEles = checkboxArray.map(checkbox => `<input type="checkbox" ${checkbox === 1 ? 'checked' : ''}/>`).join('')
    checkboxes.innerHTML = checkboxEles;
}

checkboxes.addEventListener('click', invertCheckboxes)

/*
CANVAS SECTION /////////////////////////////////////////////
*/

const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = '#ccc';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.globalCompositeOperation = 'hue';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
    if (!isDrawing) return;
    console.log(e)
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];

    hue++;
    if (hue >= 360) {
        hue = 0;
    }
    if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
        direction = !direction
    }
    if (direction) {
        ctx.lineWidth++ 
    } else {
        ctx.lineWidth--;
    }
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);


/*
COUNTRY LIST SECTION /////////////////////////////////////////////
*/

const srcData = 'https://gist.githubusercontent.com/duhaime/1d6d5a8dc77c86128fcc1a05a72726c9/raw/8b8522cbc69498b6c4983a9f58c045c2b451cb89/british-cities-to-counties.json';

const cities = [];
const counties = [];
let areas = [];

fetch(srcData)
    .then(blob => blob.json())
    .then(data => {
        cities.push(...Object.keys(data))
        counties.push(...Object.values(data))
        areas = cities.map((city, index) => {
            return (`${city}, ${counties[index]}`)
        })
    })

function findMatches(wordToMatch) {
    
    return areas.filter(place => {
        //Search GLOBAL and INCASE SENSITIVE based on variable entered
        const regex = new RegExp(wordToMatch, 'gi')
        return place.match(regex)
    })
}

function displayMatches() { 
    const matchArray = findMatches(this.value, areas);
    const html = matchArray.map(place => {
        const regex = new RegExp(this.value, 'gi');
        const areaName = place.replace(regex, `<span class="hl">${this.value}</span>`)
        return `<li>        <span class="name">${areaName}</span>        </li>        `
    }).join('')
    suggestions.innerHTML = html;
}

const searchInput = document.querySelector('.search')
const suggestions = document.querySelector('.suggestions')
searchInput.addEventListener('keyup', displayMatches)

/*
DRUMS SECTION /////////////////////////////////////////////////
*/

const keys = document.querySelectorAll('.key');

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('playing')
}

keys.forEach(key => {
    key.addEventListener('transitionend', removeTransition)
})

const playAudio = (e) => {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`)
    if (!audio) return;
    audio.currentTime = 0;
    key.classList.toggle('playing');
    // audio.play();
}

document.addEventListener('keydown', playAudio);

/*
CLOCK SECTION /////////////////////////////////////////////
*/

const secondHand = document.querySelector('.second-hand span');
const minsHand = document.querySelector('.min-hand span');
const hourHand = document.querySelector('.hour-hand span');

function setDate() {
    const now = new Date();

    const trailZeros = new Intl.NumberFormat('en-us', {
        minimumIntegerDigits: 2
    })

    const seconds = now.getSeconds();
    secondHand.innerHTML = trailZeros.format(seconds);

    const mins = now.getMinutes();
    minsHand.innerHTML = trailZeros.format(mins);;

    const hour = now.getHours();
    hourHand.innerHTML = trailZeros.format(hour);;
}

setInterval(setDate, 1000);

/*
CONTROLS SECTION /////////////////////////////////////////////
*/

const inputs = document.querySelectorAll('.controls input');

function handleUpdate() {
    console.log(inputs)
    const suffix = this.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}

inputs.forEach(input => input.addEventListener('change', handleUpdate))

/*
CONTROLS SECTION /////////////////////////////////////////////
*/

const panels = document.querySelectorAll('.panel');

function toggleOpen() {
    this.classList.toggle('open')
}

function toggleActive(e) {
    if (e.propertyName.includes('flex')) {
        this.classList.toggle('open-active')
    }
}

panels.forEach(panel => panel.addEventListener('click', toggleOpen))
panels.forEach(panel => panel.addEventListener('transitionend', toggleActive))

