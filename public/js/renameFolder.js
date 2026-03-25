// rename folder dialog
const openRenameFolderButton = document.querySelector(
	".open-rename-folder-dialog",
);
const renameFolderDialog = document.querySelector(".dialog-rename-folder");
const renameFolderInput = document.querySelector("#rename-folder-input");
const closeRenameFolderButton = document.querySelector(
	".close-folder-rename-dialog",
);

openRenameFolderButton.addEventListener("click", (e) => {
	renameFolderDialog.showModal();
	renameFolderInput.focus();
});

renameFolderDialog.addEventListener("click", (e) => {
	if (e.target === renameFolderDialog) {
		renameFolderDialog.close();
	}
});

closeRenameFolderButton.addEventListener("click", (e) => {
	renameFolderDialog.close();
});
