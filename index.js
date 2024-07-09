let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modelCont = document.querySelector(".model-cont");
let ticketCont = document.querySelector(".ticket-cont");
let mainCont = document.querySelector(".main-content");
let textArea = document.querySelector(".textArea-cont");
let priorityColor = document.querySelectorAll(".priority-color");
let activeProfileColor = document.querySelector(".active");
let ticketColorClass = document.querySelector(".ticket-color");

let modelColor = "lightpink";
let removeTaskFlag = false;

let ticketsArr = [];






let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let addTaskFlag = false;
modelCont.style.display = "none";

if(localStorage.getItem("tickets")) {

  ticketsArr = JSON.parse(localStorage.getItem("tickets"))

  ticketsArr.forEach(function(ticket){
    CreateTicketContainer(ticket.text , ticket.color , ticket.ticketId)
  })

}

addBtn.addEventListener("click", () => {
  addTaskFlag = !addTaskFlag;

  if (addTaskFlag == true) {
    modelCont.style.display = "flex";
  } else {
    modelCont.style.display = "none";
  }
});

priorityColor.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    priorityColor.forEach(function (clickedcolor) {
      clickedcolor.classList.remove("active");
    });
    colorElem.classList.add("active");
    modelColor = colorElem.classList[0];
    //console.log(modelColor)
  });
});

modelCont.addEventListener("keydown", (e) => {
  let key = e.key;

  let textAraeData = textArea.value;

  if (key == "Enter") {
    CreateTicketContainer(textAraeData, modelColor);
    modelCont.style.display ='none'
    textArea.value = ''
  }
});

function CreateTicketContainer(text, color,ticketId) {
  let id = ticketId|| shortid();
  // console.log(id);
  let ticketDiv = document.createElement("div");
  ticketDiv.setAttribute("class", "ticket-cont");
  ticketDiv.innerHTML = `<div class="ticket-color-cont ${color}"></div>
            <div class="ticket-id">${ticketId}</div>
            <div class="ticket-task">${text}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>`;

  mainCont.appendChild(ticketDiv);
  lockPropery(ticketDiv, id);
  addTaskFlag = false;
  modelCont.style.display = "none";
  handleRemoveBtn(ticketDiv, id);
  changeColorBand(ticketDiv ,id);

  if(!ticketId) {
    ticketsArr.push({text , color , ticketId:id})
    localStorage.setItem("tickets",JSON.stringify(ticketsArr))
  }
}

function lockPropery(ticket , id) {
  let lock = ticket.querySelector(".ticket-lock");
  let lockChildren = lock.children[0];

 

  let contentArea = document.querySelector(".ticket-task");
  lockChildren.addEventListener("click", function () {
    let index = getIndx(id)
    if (lockChildren.classList.contains(lockClass)) {
      lockChildren.classList.remove(lockClass);
      lockChildren.classList.add(unlockClass);
      contentArea.setAttribute("contenteditable", "true");
    } else {
      lockChildren.classList.remove(unlockClass);
      lockChildren.classList.add(lockClass);
      contentArea.setAttribute("contenteditable", "false");
    }

    ticketsArr[index].text = contentArea.innerText
  localStorage.setItem("tickets",JSON.stringify(ticketsArr))
  });

  

}

removeBtn.addEventListener("click", function () {
  removeTaskFlag = !removeTaskFlag;
  if (removeTaskFlag === true) {
    alert("Delete Button is Activated");
    removeBtn.style.color = "red";
  } else {
    alert("Delete Button is De-Activated");
    removeBtn.style.color = "black";
  }
});

function handleRemoveBtn(ticket ,id) {
  ticket.addEventListener("click", () => {
   
    if (!removeTaskFlag) return;
    let idx = getIndx(id)
    ticket.remove();
    ticketsArr.splice(idx,1)
    localStorage.setItem("tickets",JSON.stringify(ticketsArr))
  });
}

let colors = [
  "priorityred",
  "prioritygreen",
  "priorityyellow",
  "priorityblack",
];

function changeColorBand(ticket, id) {
  let colorBand = ticket.querySelector(".ticket-color-cont");

  colorBand.addEventListener("click", function () {

    let index = getIndx(id)
    let currentColor = colorBand.classList[1];

    console.log(currentColor);

    let currentColorIndx = colors.findIndex(function (color) {
      return currentColor == color;
    });

    currentColorIndx++;

    let currentColorBand = currentColorIndx % colors.length;

    let color = colors[currentColorBand];

    colorBand.classList.remove(currentColor);
    colorBand.classList.add(color);

    ticketsArr[index].color =color

    localStorage.setItem("tickets",JSON.stringify(ticketsArr))
  });
}

let colorBox = document.querySelectorAll(".color");

// console.log(colorbox);

for (let i = 0; i < colorBox.length; i++) {
  colorBox[i].addEventListener("click", function () {
    let resultBoxColor = colorBox[i].classList[1];

    
    let alltickets = document.querySelectorAll(".ticket-cont");
    let filteredTickets = ticketsArr.filter((priorityColor)=>{
      return resultBoxColor === priorityColor.color
    })

    console.log(filteredTickets);

    //    console.log(alltickets);

    for (let i = 0; i < alltickets.length; i++) {
      alltickets[i].remove();
    }

    filteredTickets.forEach(function(filter){

      CreateTicketContainer(filter.text , filter.color , filter.ticketId)
    })
  });

  
}


function getIndx(id) {

  let selectedIndex = ticketsArr.findIndex(function(ticket){
    return ticket.ticketId === id
  })

  return selectedIndex
}
