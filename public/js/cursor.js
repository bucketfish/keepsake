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

  if (distanceFromLast(e.clientX, e.clientY) > (window.innerWidth / 30)) {
    newBead(e.clientX, e.clientY, angleFromLast(last, {x: e.clientX, y: e.clientY}));

    last.x = e.clientX;
    last.y = e.clientY;
  }
  
  if (images.length > 5) {

    images[0].remove();
    images.shift();
  }


}

window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);

// const images = document.getElementsByClassName("image");
//
// let globalIndex = 0,
//     last = { x: 0, y: 0 };
//
// const activate = (image, x, y) => {
//   image.style.left = `${x}px`;
//   image.style.top = `${y}px`;
//   image.style.zIndex = globalIndex;
//
//   image.dataset.status = "active";
//
//   last = { x, y };
// }
//
// const distanceFromLast = (x, y) => {
//   return Math.hypot(x - last.x, y - last.y);
// }
//
// const handleOnMove = e => {
//   if(distanceFromLast(e.clientX, e.clientY) > (window.innerWidth / 20)) {
//     const lead = images[globalIndex % images.length],
//           tail = images[(globalIndex - 5) % images.length];
//
//     activate(lead, e.clientX, e.clientY);
//
//     if(tail) tail.dataset.status = "inactive";
//
//     globalIndex++;
//   }
// }
