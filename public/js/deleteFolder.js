// delete folder dialog code
const openFolderDeleteButton = document.querySelector(
	".open-delete-folder-dialog",
);
const folderDeleteDialog = document.querySelector(".dialog-folder-delete");
const closeFolderDeleteDialog = document.querySelector(
	".close-delete-folder-dialog",
);
const confirmFolderDeleteDialog = document.querySelector(
	".confirm-folder-delete-button",
);

openFolderDeleteButton.addEventListener("click", (e) => {
	folderDeleteDialog.showModal();
});

folderDeleteDialog.addEventListener("click", (e) => {
	if (e.target === folderDeleteDialog) {
		folderDeleteDialog.close();
	}
});

closeFolderDeleteDialog.addEventListener("click", () => {
	folderDeleteDialog.close();
});

confirmFolderDeleteDialog.addEventListener("click", async (e) => {
	e.preventDefault();
	const pathArray = window.location.pathname.split("/");
	const folderId = Number(pathArray[pathArray.length - 1]);
	console.log("delete request sent");
	const response = await fetch(`/upload/delete-folder/${folderId}`, {
		method: "DELETE",
	});

	if (response.ok) {
		window.location.href = "/home";
	}
});
