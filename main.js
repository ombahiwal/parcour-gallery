const cardCanvas = document.querySelector(".canvas");
const cardContainer = document.querySelector(".cards");
const cards = document.querySelectorAll(".card:not(.hidden)");
const ratio = [3, 4];
const slackFraction = 5;

let isDragging = false;
let isDown = false;
let velX;
let startX;
let velY;
let startY;
// drag cards (jquery + jquery ui)
$(".cards").draggable({
  drag: function (evt, ui) {
    isDragging = true;
    let left = ui.position.left,
      top = ui.position.top,
      offsetWidth = $(this).width() - $(this).parent().width(),
      offsetHeight = $(this).height() - $(this).parent().height();

    if (top > 150) {
      ui.position.top = 150;
    }
    if (offsetHeight < -top - 150) {
      ui.position.top = -offsetHeight - 150;
    }
    if (left > 150) {
      ui.position.left = 150;
    }
    if (left < -offsetWidth - 150) {
      ui.position.left = -offsetWidth - 150;
    }

    // momentum
    if (!isDown) return;
    const x = startX - left;
    const y = startY - top;
    const prevScrollLeft = startX;
    const prevScrollTop = startY;
    velX = left - prevScrollLeft;
    velY = top - prevScrollTop;
  },
  start: function (evt, ui) {
    // set momentum
    isDown = true;
    // slider.classList.add("active");
    startX = ui.position.left;
    startY = ui.position.top;
    cancelMomentumTracking(); // Stop the drag momentum loop
  },
  stop: function (evt, ui) {
    let left = ui.position.left,
      top = ui.position.top,
      offsetWidth = $(this).width() - $(this).parent().width(),
      offsetHeight = $(this).height() - $(this).parent().height();
    let adjustLeft;
    let adjustTop;

    adjustLeft = left > 0 ? 0 : adjustLeft;
    adjustLeft = left < -offsetWidth ? -offsetWidth : adjustLeft;
    adjustTop = top > 0 ? 0 : adjustTop;
    adjustTop = offsetHeight < -top ? -offsetHeight : adjustTop;

    if (adjustLeft != undefined || adjustTop != undefined) {
      cancelMomentumTracking(); // Stop the drag momentum loop
      $(this).animate(
        {
          left: adjustLeft,
          top: adjustTop,
        },
        300
      );
    } else {
      // cancel momentum
      isDown = false;
      beginMomentumTracking(); // Start a frame loop to continue drag momentum
      // slider.classList.remove("active");
    }

    // prevent clicking a link while dragging
    setTimeout(function () {
      isDragging = false;
    }, 100);
  },
});

// Momentum

let momentumID;

function beginMomentumTracking() {
  cancelMomentumTracking();
  momentumID = requestAnimationFrame(momentumLoop);
}

function cancelMomentumTracking() {
  cancelAnimationFrame(momentumID);
}

function momentumLoop() {
  const bounds = cardContainer.getBoundingClientRect();
  cardContainer.style.left = bounds.left + velX / 10 + "px"; // Apply the velocity to the scroll position
  cardContainer.style.top = bounds.top + velY / 10 + "px"; // Apply the velocity to the scroll position
  velX *= 0.9; // Slow the velocity slightly
  velY *= 0.9; // Slow the velocity slightly
  if (
    (Math.abs(velX) > 1 || Math.abs(velY) > 1) &&
    bounds.left < 0 &&
    bounds.right > cardCanvas.offsetWidth &&
    bounds.top < 0 &&
    bounds.bottom > cardCanvas.offsetHeight
  ) {
    console.log(bounds.bottom, cardCanvas.offsetHeight);
    // Still moving and not touching bounds?
    momentumID = requestAnimationFrame(momentumLoop); // Keep looping
  }
}

// label follows cursor
const mouseSafetyDistance = 16;
cards.forEach((el) => {
  content = el.querySelector("a");
  content.addEventListener("mousemove", function (e) {
    const label = el.querySelector(".label");
    const bounds = el.getBoundingClientRect();
    label.classList.remove("hidden");
    label.classList.add("label--active");
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    label.style.left = mouseX - bounds.left + mouseSafetyDistance + "px";
    label.style.top = mouseY - bounds.top + mouseSafetyDistance + "px";
  });
  content.addEventListener("mouseleave", function () {
    const label = el.querySelector(".label");
    label.classList.add("hidden");
  });
  content.addEventListener("click", function (e) {
    if (isDragging) return;
    e.currentTarget.parentElement.parentElement.classList.add("hidden");
    placeInGrid();
  });
});

// scatter Cards

function placeInGrid() {
  const ratioA = 9;
  const ratioB = 16;
  const elements = document.querySelectorAll(".card:not(.hidden)");
  // get card width
  const cardWidth = elements[0].offsetWidth;
  const cardHeight = elements[0].offsetHeight;
  // calculate container
  const emptySpace = 0; // how much space should be empty
  const safetyDistance = 200;
  // calculate sides of Container (how many cards fit on each side)
  let edgeA = Math.ceil(
    Math.sqrt(elements.length * (ratioB / ratioA)) * (ratioA / ratioB)
  );
  let edgeB = Math.ceil(Math.sqrt(elements.length * (ratioB / ratioA)));
  // console.log(edgeA, edgeB);

  cardContainer.style.width =
    cardWidth * (edgeB + 1 + edgeB * emptySpace) +
    edgeB * (0.5 * safetyDistance) +
    safetyDistance +
    "px";
  cardContainer.style.height =
    cardHeight * (edgeA + 1 + edgeA * emptySpace) +
    edgeA * (0.5 * safetyDistance) +
    safetyDistance +
    "px";

  cardContainer.style.left =
    -(cardContainer.offsetWidth - cardCanvas.offsetWidth) / 2 + "px";
  cardContainer.style.top =
    -(cardContainer.offsetHeight - cardCanvas.offsetHeight) / 2 + "px";

  const placementColumns = [];
  const placementRows = [];
  const placedColumns = [];
  const placedRows = [];

  for (let i = 0; i < edgeB + Math.ceil(edgeB * emptySpace); i++) {
    distributeArray(edgeB, emptySpace, i, placementColumns);
  }
  for (let i = 0; i < edgeA + Math.ceil(edgeA * emptySpace); i++) {
    distributeArray(edgeA, emptySpace, i, placementRows);
  }

  // console.log(`Cols: ${placementColumns}, Rows: ${placementRows}`);
  // console.log(placementColumns.length, placementRows.length);

  for (let i = 0; i < elements.length; i++) {
    let placed = true;
    let col;
    let row;
    // return;
    while (placed) {
      // console.log("placing");
      col = placementColumns[rand(placementColumns.length)];
      row = placementRows[rand(placementRows.length)];
      // console.log(col, row);
      for (let j = 0; j <= i; j++) {
        if (
          placedColumns.length > 0 &&
          placedColumns[j - 1] === col &&
          placedRows[j - 1] === row
        ) {
          placed = true;
          // console.log("already placed!");
          break;
        } else {
          placed = false;
          // console.log("was never placed!");
        }
      }

      // console.log(`Placed Cols: ${placedColumns}, Placed Rows: ${placedRows}`);
    }
    // check if combination exists
    if (!placed) {
      elements[i].style.setProperty(
        "--shiftLeft",
        cardWidth * col +
          (col * safetyDistance) / 2 +
          randRange(0.3 * safetyDistance, -0.3 * safetyDistance) +
          "px"
      );
      elements[i].style.setProperty(
        "--shiftTop",
        cardHeight * row +
          (row * safetyDistance) / 2 +
          randRange(0.3 * safetyDistance, -0.3 * safetyDistance) +
          "px"
      );
      placedColumns.push(col);
      placedRows.push(row);
      // console.log(placedColumns, placedRows);
    }
  }
}

const rand = (num) => Math.floor(Math.random() * num);
const randRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

function distributeArray(edgeDir, emptySpace, index, placement) {
  let edge = edgeDir + Math.ceil(edgeDir * emptySpace);
  // console.log(edge);
  if (edge % 2 === 0) {
    // even number
    index < edge / 2
      ? placement.push(-edge / 2 + index + 0.5)
      : placement.push(index - edge / 2 + 1 - 0.5);
  } else {
    // uneven number
    index < edge / 2
      ? placement.push(Math.ceil(-edge / 2 + index))
      : placement.push(Math.ceil(index - edge / 2));
  }
}

placeInGrid();

let timer;
window.addEventListener("resize", function () {
  clearTimeout(timer);
  timer = setTimeout(afterTimeout, 250);
});

function afterTimeout() {
  placeInGrid();
}
