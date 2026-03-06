const openButton = document.querySelector(".index__open-file-upload-dialog");
const closeButton = document.querySelector(".index__close-file-upload-dialog");
const fileUploadDialog = document.querySelector(".index__file-upload-dialog");
const fileUploadDialogContainer = document.querySelector(
	".index__file-upload-dialog-container",
);

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
