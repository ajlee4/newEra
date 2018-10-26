const calcRoom = document.querySelector(".calc__room");
const calcRestroom = document.querySelector(".calc__restroom");
const result = document.querySelector(".result");
let countRoom = 1;
let countRestroom = 1;
let value = 42.9;


const counterRoomNext = () => {
  countRoom++
  room.innerHTML = countRoom + " комнат"
  if (countRoom < 5) {
    room.innerHTML = countRoom + " комнаты"
  }
  value += 14;
  calcResult();
}


const counterRoomPrev = () => {
  countRoom--
  room.innerHTML = countRoom + " комната"
  if (countRoom > 1) {
    room.innerHTML = countRoom + " комнаты"
  }
  value -= 14;
  calcResult();
}


const counterRestroomNext = () => {
  countRestroom++
  restroom.innerHTML = countRestroom + " санузлов"
  if (countRestroom < 5) {
    restroom.innerHTML = countRestroom + " санузла"
  }
  value += 13;
  calcResult();
}


const counterRestroomPrev = () => {
  countRestroom--
  restroom.innerHTML = countRestroom + " санузел"
  if (countRestroom > 1) {
    restroom.innerHTML = countRestroom + " санузла"
  }
  value -= 13;
  calcResult();
}


const calcResult = () => {
  return result.innerHTML = "Заказать за " + value.toFixed(1) + " руб";
}


calcResult();



calcRoom.addEventListener("click", function(e) {

  if (e.target.classList.contains('next') && countRoom != 5) {
    counterRoomNext()
  }
  if (e.target.classList.contains('prev') && countRoom != 1) {
    counterRoomPrev()
  }
});

calcRestroom.addEventListener("click", function(e) {

  if (e.target.classList.contains('next') && countRestroom != 5) {
    counterRestroomNext()
  }
  if (e.target.classList.contains('prev') && countRestroom != 1) {
    counterRestroomPrev()
  }
});
