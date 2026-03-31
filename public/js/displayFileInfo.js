const uploadedFiles = document.querySelectorAll(".uploaded-files");
const fileInfoDiv = document.querySelector(".file-info-div");
const fileInfo = {
	id: undefined,
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
const fileInfoDeleteButton = document.createElement("button");
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
fileInfoDeleteButton.textContent = "Delete";
fileInfoShareLink.textContent = "Share";
fileInfoDownloadLink.textContent = "Download";

fileInfoDownloadLink.classList.add("file-info-download-link");
fileInfoDeleteButton.classList.add("file-info-button");
fileInfoCloseButton.classList.add("file-info-button");

fileInfoFooter.append(
	fileInfoCloseDivFooter,
	fileInfoShareLink,
	fileInfoDeleteButton,
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

fileInfoDeleteButton.addEventListener("click", async (e) => {
	const loaderSpinner = document.createElement("div");
	loaderSpinner.classList.add("loader-spinner");
	e.preventDefault();

	// Show loading
	fileInfoDeleteButton.textContent = "";
	fileInfoDeleteButton.append(loaderSpinner);
	fileInfoDeleteButton.disabled = true;

	const response = await fetch(`/upload/delete-file/${fileInfo.id}`, {
		method: "DELETE",
	});

	const data = await response.json();

	// Reset
	fileInfoDeleteButton.textContent = "Delete";
	fileInfoDeleteButton.disabled = false;

	if (response.ok) {
		if (data.folderId === null) {
			window.location.href = "/home";
		} else if (typeof data.folderId === "number") {
			window.location.href = `/home/${data.folderId}`;
		}
	}
});

fileInfoDownloadLink.addEventListener("click", async (e) => {
	// window.location.href = `/upload/download-file/${fileInfo.id}`;
	const loaderSpinner = document.createElement("div");
	loaderSpinner.classList.add("loader-spinner");
	e.preventDefault();

	// Show loading
	fileInfoDownloadLink.textContent = "";
	fileInfoDownloadLink.append(loaderSpinner);
	fileInfoDownloadLink.disabled = true;

	const res = await fetch(`/upload/download-file/${fileInfo.id}`);
	const blob = await res.blob();

	// Trigger download manually
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileInfo.name; // or parse from Content-Disposition header
	a.click();
	URL.revokeObjectURL(url);

	// Reset
	fileInfoDownloadLink.textContent = "Download";
	fileInfoDownloadLink.disabled = false;
});

uploadedFiles.forEach((file) => {
	file.addEventListener("click", (e) => {
		e.stopPropagation();

		fileInfo.id = file.dataset.id;
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
