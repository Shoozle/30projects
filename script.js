/*
FOLLOW ALONG LINKS RECOGNITION /////////////////////////////////////////////
*/

const triggers = document.querySelectorAll('.followLink');

const highlight = document.createElement('span');
highlight.classList.add('highlight');
document.body.append(highlight);

function highlightLink() {
    const linkCoords = this.getBoundingClientRect();
    const coords = {
        width: linkCoords.width,
        height: linkCoords.height,
        top: linkCoords.top + window.scrollY,
        left: linkCoords.left + window.scrollX
    }
    highlight.style.width = `${coords.width}px`;
    highlight.style.height = `${coords.height}px`;
    highlight.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
}





triggers.forEach(a => a.addEventListener('mouseenter', highlightLink));

/*
SPEECH RECOGNITION /////////////////////////////////////////////
*/

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
    console.log(e)
    const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')

    p.textContent = transcript;
    if (e.results[0].isFinal) {
        p = document.createElement('p');
        words.appendChild(p)
    }
    console.log(transcript)
})

recognition.addEventListener('end', recognition.start);

recognition.start();

/*
WEBCAM FUN /////////////////////////////////////////////
*/

const webcamvideo = document.querySelector('.webcam__player');
const webcamcanvas = document.querySelector('.webcam__photo');
const webcamctx = webcamcanvas.getContext('2d');
const stripp = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            webcamvideo.srcObject = localMediaStream;
            webcamvideo.play();
        })
        .catch(err => {
            console.error('OH NO', err);
        })
}

function paintToCanvas() {
    const width = webcamvideo.videoWidth;
    const height = webcamvideo.videoHeight;
    webcamcanvas.width = width;
    webcamcanvas.height = height;

    return setInterval(() => {
        webcamctx.drawImage(webcamvideo, 0, 0, width, height)
        let pixels = webcamctx.getImageData(0, 0, width, height);
        pixels = greenScreen(pixels)
        // pixels = rgbSplit(pixels);
        // webcamctx.globalAlpha = 0.1;
        webcamctx.putImageData(pixels, 0, 0)
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = webcamcanvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src=${data} alt="handsome man"/>`
    stripp.insertBefore(link, stripp.firstChild);
    console.log(data)
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i = i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] - 100
        pixels.data[i + 1] = pixels.data[i + 1] - 50
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i = i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]
        pixels.data[i + 200] = pixels.data[i + 1]
        pixels.data[i - 150] = pixels.data[i + 2]
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value;
    })

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

getVideo();

webcamvideo.addEventListener('canplay', paintToCanvas);

/*
VIDEO TIMES CODE /////////////////////////////////////////////
*/

const timeNodes = Array.from(document.querySelectorAll('[data-time]'));

const seconds = timeNodes
    .map(node => node.dataset.time)
    .map(timeCode => {
        const [mins, secs] = timeCode.split(':').map(parseFloat);
        return (mins * 60) + secs;
    })
    .reduce((total, vidSeconds) => total + vidSeconds);

let secondsLeft = seconds;
const hours = Math.floor(secondsLeft / 3600);
secondsLeft = secondsLeft % 3600;

const mins = Math.floor(secondsLeft / 60);
secondsLeft = secondsLeft % 60;

const trailZeros = new Intl.NumberFormat('en-us', {
    minimumIntegerDigits: 2
})


console.log(trailZeros.format(hours), trailZeros.format(mins), trailZeros.format(secondsLeft))

const totalTime = document.querySelector('.totalTime')
totalTime.innerHTML = `${trailZeros.format(hours)} : ${trailZeros.format(mins)} : ${trailZeros.format(secondsLeft)}`

/*
BANDS CODE /////////////////////////////////////////////
*/

const bands = ['The Silent Comedy', 'Lets Eat Grandma', 'Go Ichinose', 'ACE', 'Fleetwood Mac', 'The Dead South', 'The Airborne Toxic Event', 'The Pillows', 'Poets of the Fall', 'Metric', 'Avicii', 'A Band to Remember', 'The Oh Hellos', 'The Vaccines']

document.querySelector('.bands__list').innerHTML = bands.map(band => `<li>${band}`).join('')

function strip(bandName) {
    return bandName.replace(/^(a |the |an)/i, '').trim();
}

function sortBands() {
    const sortedBands = bands.sort((a, b) => strip(a) > strip(b) ? 1 : -1);
    document.querySelector('.bands__list').innerHTML = sortedBands.map(band => `<li>${band}`).join('')
}

const sortBandsBtn = document.querySelector('.sortbandsBtn');
sortBandsBtn.addEventListener('click', sortBands);

/*
CSS SHADOW CODE /////////////////////////////////////////////
*/

const container = document.querySelector('.text__container');
const shadowtext = container.querySelector('h1');
const walk = 500;

function shadow(e) {
    const { offsetWidth: width, offsetHeight: height } = container;
    let { offsetX: x, offsetY: y } = e;

    if (this !== e.target) {
        x = x + e.target.offsetLeft;
        y = y + e.target.offsetTop;
    }

    const xWalk = Math.round((x / width * walk) - (walk / 2));
    const yWalk = Math.round((y / height * walk) - (walk / 2));

    shadowtext.style.textShadow = `${xWalk}px ${yWalk}px 0 red`;
}

container.addEventListener('mousemove', shadow)

/*
MEAL DEALS CODE /////////////////////////////////////////////
*/

const addMains = document.querySelector('.newMainForm');
const addSnacks = document.querySelector('.newSnackForm');
const addDrinks = document.querySelector('.newDrinkForm');
const mainsList = document.querySelector('.main__list');
const snacksList = document.querySelector('.snack__list');
const drinksList = document.querySelector('.drink__list');
const mains = JSON.parse(localStorage.getItem('mains')) || [];
const snacks = JSON.parse(localStorage.getItem('snacks')) || [];
const drinks = JSON.parse(localStorage.getItem('drinks')) || [];

function addItem(e) {
    e.preventDefault();
    const text = (this.querySelector('[name=addmain]')).value;
    const item = {
        text,
        done: false
    };

    mains.push(item);
    populateList(mains, mainsList);
    localStorage.setItem('mains', JSON.stringify(mains));
    this.reset();
}

function populateList(plates = [], platesList) {
    platesList.innerHTML = plates.map((plate, i) => {
        return `
        <li>
        <input type="radio" name="main" data-index=${i} id="item${i}" />
        <label for="item${i}">${plate.text}</label>
        </li>
      `;
    }).join('');
}

function toggleDone(e) {
    if (!e.target.matches('input')) return; // skip this unless it's an input
    const el = e.target;
    const index = el.dataset.index;
    mains[index].done = !mains[index].done;
    localStorage.setItem('mains', JSON.stringify(mains));
    populateList(mains, mainsList);
}

addMains.addEventListener('submit', addItem);
mainsList.addEventListener('click', toggleDone);

populateList(mains, mainsList);



/*
SLIDING IN CODE /////////////////////////////////////////////
*/

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
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

function checkSlide(e) {
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
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0,
    0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]
//15 cols

const checkboxEles = checkboxArray.map(checkbox => `<input type="checkbox" ${checkbox === 1 ? 'checked' : ''}/>`).join('')
checkboxes.innerHTML = checkboxEles;

function invertCheckboxes() {
    for (i = 0; i < checkboxArray.length; i++) {
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

