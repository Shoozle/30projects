/*
SLIDING IN CODE /////////////////////////////////////////////
*/

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const sliderImages = document.querySelectorAll('.slide-in');

function checkSlide(e){
    sliderImages.forEach(sliderImage => {
        const slideInAt = (window.scrollY + window.innerHeight) - sliderImage.height / 2;
        const imageBottom = sliderImage.offsetTop + sliderImage.height;
        const isHalfShown = slideInAt > sliderImage.offsetTop;
        const isNotScrolledPast = window.scrollY < imageBottom;
        if (isHalfShown && isNotScrolledPast) {
            sliderImage.classList.add('active')
        }
    })
}

window.addEventListener('scroll', debounce(checkSlide));

/*
KONAMI CODE /////////////////////////////////////////////
*/

const pressed = [];
const secretCode = 'uuddlrlrba'

function addLetter(e) {
    switch (e.keyCode) {
        case 38:
        pressed.push('u')
    }
    switch (e.keyCode) {
        case 40:
        pressed.push('d')
    }
    switch (e.keyCode) {
        case 37:
        pressed.push('l')
    }
    switch (e.keyCode) {
        case 39:
        pressed.push('r')
    }
    switch (e.keyCode) {
        case 66:
        pressed.push('b')
    }
    switch (e.keyCode) {
        case 65:
        pressed.push('a')
    }
    pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
    if (pressed.join('').includes(secretCode)) {
        const konamiHeading = document.querySelector('.konami')
        konamiHeading.innerHTML = `shhhh, it's a secret!`
    }
}

window.addEventListener('keyup', addLetter)

/*
VIDEO PLAYER SECTION /////////////////////////////////////////////
*/

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const ranges = player.querySelectorAll('.player__slider');

function togglePlay() { 
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}
function updateButton() {
    const icon = this.paused ? '►' : '❚❚';
    toggle.textContent = icon;
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

toggle.addEventListener('click', togglePlay);

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

/*
TASKS SECTION /////////////////////////////////////////////
*/

const taskchecks = document.querySelectorAll('.check');

let lastChecked;

function handleTask(e) { 
    let inbetween = false;
    if (e.shiftKey && this.checked) {
        taskchecks.forEach(taskcheck => {
            if (taskcheck === this || taskcheck === lastChecked) {
                inbetween = !inbetween;
            }
            if (inbetween) {
                taskcheck.checked = true
            }
        })
    }
    lastChecked = this;
}

taskchecks.forEach(task => task.addEventListener('click', handleTask))

/*
CHECKBOX SECTION /////////////////////////////////////////////
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


let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
    if (!isDrawing) return;
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

