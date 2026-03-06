const openButton = document.querySelector(".open-file-upload-dialog");
const closeButton = document.querySelector(".close-file-upload-dialog");
const fileUploadDialog = document.querySelector(".dialog-file-upload");
const fileUploadDialogContainer = document.querySelector(".dialog-container");

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
