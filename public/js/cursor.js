const bead = document.getElementsByClassName('cursor-bead')[0];
const beadWrapper = document.getElementById('cursor-beads-wrapper');

var last = { x: 0, y: 0 };

var images = []

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function newBead(x, y, rotate) {
  const beadImagesCount = 24;

  var newImage = document.createElement("img");
  var beadImageCount = getRandomInt(beadImagesCount + 1);

  newImage.src = `/assets/beads/bead${beadImageCount}.png`
  newImage.classList.add('cursor-bead');

  beadWrapper.appendChild(newImage)
  images.push(newImage)


  newImage.style.left = `${x}px`;
  newImage.style.top = `${y}px`;
  newImage.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
}

const distanceFromLast = (x, y) => {
  return Math.hypot(x - last.x, y - last.y);
}

const angleFromLast = (last, current) => {
  var theta = Math.atan2(last.y - current.y, last.x - current.x) * 180 / Math.PI - 90;
  return theta;

};

const handleOnMove = e => {

  var position = { x: e.clientX + window.pageXOffset, y: e.clientY + window.pageYOffset}
  if (distanceFromLast(position.x, position.y) > (40)) {

    newBead(position.x, position.y, angleFromLast(last, position));

    last.x = position.x;
    last.y = position.y;
  }

  if (images.length > 5) {

    images[0].remove();
    images.shift();
  }


}

window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);
