const dialogOption = document.querySelector(".dialog-option");
const dialogContainer = document.querySelector(".index__dialog-container");
const openButton = document.querySelector(".index__dialog-open-button");

openButton.addEventListener("click",() => {
    dialogOption.showModal();
})

dialogOption.addEventListener("click",e => {
  if(e.target !== dialogContainer){
    dialogOption.close();
  }
})
