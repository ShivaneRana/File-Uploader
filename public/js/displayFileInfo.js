const uploadedFiles = document.querySelectorAll(".uploaded-files");
const fileInfoDiv = document.querySelector(".file-info-div");
const fileInfo = {
	name: undefined,
	type: undefined,
	size: undefined,
	date: undefined,
};
const fileName = document.createElement("p");
const fileSize = document.createElement("p");
const fileDate = document.createElement("p");
const fileType = document.createElement("p");

// file info Div heading
const fileInfoHeader = document.createElement("div");
const fileInfoCloseButton = document.createElement("button");
const fileInfoHeading = document.createElement("h3");

// this is where file name ,type ,size and date will be kept
const fileInfoContent = document.createElement("div");

// file info Div footer
const fileInfoFooter = document.createElement("div");
const fileInfoDownloadLink = document.createElement("a");
const fileInfoShareLink = document.createElement("button");
const fileInfoDeleteLink = document.createElement("a");
const fileInfoCloseDivFooter = document.createElement("button");

// assing class to fileInfoContent where file name,type,size and date is stored.
fileInfoContent.classList.add("file-info-content");

// assign content to header element and append to parent div
fileInfoCloseButton.textContent = "X";
fileInfoHeading.textContent = `File Information`;
fileInfoHeader.append(fileInfoHeading, fileInfoCloseButton);
fileInfoHeader.classList.add("file-info-header");

// assign content to footer element and append to parent div
fileInfoCloseDivFooter.textContent = "Close";
fileInfoDeleteLink.textContent = "Delete";
fileInfoShareLink.textContent = "Share";
fileInfoDownloadLink.textContent = "Download";
fileInfoFooter.append(
	fileInfoCloseDivFooter,
	fileInfoShareLink,
	fileInfoDeleteLink,
	fileInfoDownloadLink,
);
fileInfoFooter.classList.add("file-info-footer");

fileInfoCloseButton.addEventListener("click", (e) => {
	e.stopPropagation();
	fileInfoDiv.classList.remove("show-info");
	fileInfoDiv.classList.add("hide-info");
});

fileInfoCloseDivFooter.addEventListener("click", (e) => {
	e.stopPropagation();
	fileInfoDiv.classList.remove("show-info");
	fileInfoDiv.classList.add("hide-info");
});

document.body.addEventListener("click", () => {
	if (fileInfoDiv.classList.contains("show-info")) {
		fileInfoDiv.classList.remove("show-info");
		fileInfoDiv.classList.add("hide-info");
	}
});

fileInfoDiv.addEventListener("click", (e) => {
	e.stopPropagation();
});

uploadedFiles.forEach((file) => {
	file.addEventListener("click", (e) => {
		e.stopPropagation();

		fileInfo.name = file.dataset.name;
		fileInfo.size = file.dataset.size;
		fileInfo.date = file.dataset.date;
		fileInfo.type = file.dataset.type;

		fileName.textContent = `Name: ${fileInfo.name}`;
		fileType.textContent = `Type: ${fileInfo.type}`;
		fileSize.textContent = `Size: ${fileInfo.size}`;
		fileDate.textContent = `Date: ${fileInfo.date}`;

		fileInfoContent.append(fileName, fileType, fileSize, fileDate);
		fileInfoDiv.append(fileInfoHeader, fileInfoContent, fileInfoFooter);
		fileInfoDiv.classList.remove("hide-info");
		fileInfoDiv.classList.add("show-info");
	});
});
