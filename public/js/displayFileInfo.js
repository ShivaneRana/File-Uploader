const uploadedFiles = document.querySelectorAll(".uploaded-files");
const fileInfoDiv = document.querySelector(".file-info-div");

document.body.addEventListener("click",() => {
    if(fileInfoDiv.classList.contains('show-info')){
        fileInfoDiv.classList.remove('show-info');
        fileInfoDiv.classList.add('hide-info');
    }
})

fileInfoDiv.addEventListener("click",(e) => {
    e.stopPropagation();
})

uploadedFiles.forEach(file => {
    file.addEventListener("click",(e) => {
        e.stopPropagation();
        const heading = document.createElement("h3");
        heading.textContent = 'File Information';

        const name = document.createElement("p");
        name.textContent = file.dataset.name;

        const size = document.createElement("p");
        size.textContent = file.dataset.size;

        const date = document.createElement("p");
        date.textContent = file.dataset.date;

        const type = document.createElement("p");
        type.textContent = file.dataset.type;

        const button = document.createElement("button")
        button.textContent = 'close';

        button.addEventListener("click",(e) => {
            e.stopPropagation();
            fileInfoDiv.classList.remove('show-info');
            fileInfoDiv.classList.add('hide-info');
        })

        fileInfoDiv.textContent = "";
        fileInfoDiv.append(heading,name,size,date,type,button);
        fileInfoDiv.classList.remove("hide-info");
        fileInfoDiv.classList.add("show-info");
    })
})