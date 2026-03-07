// create file dialog
const openButton = document.querySelector(".open-file-upload-dialog");
const closeButton = document.querySelector(".close-file-upload-dialog");
const fileUploadDialog = document.querySelector(".dialog-file-upload");

openButton.addEventListener("click", () => {
	fileUploadDialog.showModal();
});

fileUploadDialog.addEventListener("click", (e) => {
	if (e.target === fileUploadDialog) {
		fileUploadDialog.close();
	}
});

closeButton.addEventListener("click", () => {
	fileUploadDialog.close();
});

const openNewFolderButton = document.querySelector(
	".open-create-folder-dialog",
);
const closeNewFolderButton = document.querySelector(".close-folder-dialog");
const newFolderDialog = document.querySelector(".dialog-folder-create");
const newFolderInput = document.querySelector("#new-folder-input");

openNewFolderButton.addEventListener("click", () => {
	newFolderDialog.showModal();
	newFolderInput.focus();
});

newFolderDialog.addEventListener("click", (e) => {
	if (e.target === newFolderDialog) {
		newFolderDialog.close();
	}
});

closeNewFolderButton.addEventListener("click", () => {
	newFolderDialog.close();
});
