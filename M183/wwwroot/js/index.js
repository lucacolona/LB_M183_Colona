var isInEditMode = false;

function handleEdit(newsEntry) {
    setEditMode(newsEntry);
}

function setEditMode(newsEntry) {
    if (isInEditMode) {
        return;
    }

    var btnEdit = document.getElementById("btnEdit" + newsEntry.id);
    btnEdit.classList.add("notdisplayed");

    var btnDelete = document.getElementById("btnDelete" + newsEntry.id);
    btnDelete.classList.add("notdisplayed");

    var btnSave = document.getElementById("btnSave" + newsEntry.id);
    btnSave.classList.remove("notdisplayed");

    var btnCancel = document.getElementById("btnCancel" + newsEntry.id);
    btnCancel.classList.remove("notdisplayed");

    header = document.getElementById("header" + newsEntry.id);
    header.contentEditable = true;

    detail = document.getElementById("detail" + newsEntry.id);
    detail.contentEditable = true;
    detail.focus();

    isInEditMode = true;
}

function handleDelete(newsEntry) {
    var deleteData = {
        newsId: newsEntry.id,
    };

    fetch("/api/News/" + newsEntry.id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getJwtHeader(getJwtToken())
        },
        body: JSON.stringify(deleteData)
    })
        .then((response) => {
            if (response.ok) {
                loadNews();
            }
            else {
                alert("Failed to delete the news entry.");
            }
        })
        .catch(() => {
            alert("Error while attempting to delete the news entry.");
        });
}

function handleCancel(newsEntry) {
    isInEditMode = false;
    loadNews();
}

function handleSave(newsEntry) {
    isInEditMode = false;
    var detailElement = document.getElementById("detail" + newsEntry.id);
    var data = {
        header: newsEntry.header,
        detail: detailElement.innerText,
        authorId: newsEntry.authorId,
        isAdminNews: newsEntry.isAdminNews
    }

    fetch("/api/News/" + newsEntry.id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getJwtHeader(getJwtToken())
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (response.ok) {
                loadNews();
            }
            else {
                alert("NOK");
            }
        })
        .catch(() => {
            alert("Error");
        });
}

function loadNews() {
    fetch("/api/News", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getJwtHeader(getJwtToken())
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText + " (" + response.status + ")");
            }
        })
        .then((data) => {
            createNewsList(data);
        })
        .catch((error) => {
            alert(error);
        });
}

function createNewsList(data) {
    var currentUserId = getUserid();

    var mainTitle = document.createElement("h1");
    mainTitle.innerText = 'Home';

    var main = document.getElementById("main");
    main.innerHTML = "";
    main.appendChild(mainTitle);

    for (var i = 0; i < data.length; i++) {
        var newsEntry = data[i];

        // Entry.
        var divEntry = document.createElement("div");
        divEntry.classList.add("newsEntry");

        // Header
        var header = document.createElement("div");
        header.classList.add("newsHeader");
        if (newsEntry.isAdminNews) {
            header.classList.add("adminNews");
        }
        header.id = "header" + newsEntry.id;
        header.innerText = newsEntry.header;
        divEntry.appendChild(header);

        // Detail.
        var detail = document.createElement("div");
        detail.id = "detail" + newsEntry.id;
        detail.classList.add("newsDetail");
        detail.innerText = newsEntry.detail;
        divEntry.appendChild(detail);

        // Info about user and posted date.
        var newsEntryInfo = document.createElement("div");
        newsEntryInfo.classList.add("newsEntryInfo");
        /** @type {Date} */
        var postedDate = new Date(newsEntry.postedDate);
        var displayedDate = postedDate.getDate() + '.' + (postedDate.getMonth() + 1) + '.' + postedDate.getFullYear();
        displayedDate += ', ' + postedDate.getHours() + ':' + postedDate.getMinutes() + ':' + postedDate.getSeconds();
        newsEntryInfo.innerText = newsEntry.author.username + ', ' + displayedDate;
        divEntry.appendChild(newsEntryInfo);

        if (isAdmin() || newsEntry.authorId == currentUserId) {
            // Edit button.
            var btnEdit = document.createElement("button");
            btnEdit.id = "btnEdit" + newsEntry.id;
            btnEdit.classList.add("btnEdit");
            btnEdit.innerText = "Edit";
            (function (arg) {
                btnEdit.addEventListener("click", function () {
                    handleEdit(arg);
                });
            })(newsEntry);

            // Delete button.
            var btnDelete = document.createElement("button");
            btnDelete.id = "btnDelete" + newsEntry.id;
            btnDelete.classList.add("btnDelete");
            btnDelete.innerText = "Delete";
            (function (arg) {
                btnDelete.addEventListener("click", function () {
                    handleDelete(arg);
                });
            })(newsEntry);

            // Save button.
            var btnSave = document.createElement("button");
            btnSave.id = "btnSave" + newsEntry.id;
            btnSave.classList.add("btnSave");
            btnSave.classList.add("notdisplayed");
            btnSave.innerText = "Save";
            (function (arg) {
                btnSave.addEventListener("click", function () {
                    handleSave(arg);
                });
            })(newsEntry);

            // Cancel button.
            var btnCancel = document.createElement("button");
            btnCancel.id = "btnCancel" + newsEntry.id;
            btnCancel.classList.add("btnCancel");
            btnCancel.classList.add("notdisplayed");
            btnCancel.innerText = "Cancel";
            (function (arg) {
                btnCancel.addEventListener("click", function () {
                    handleCancel(arg);
                });
            })(newsEntry);

            divEntry.appendChild(btnEdit);
            divEntry.appendChild(btnDelete);
            divEntry.appendChild(btnSave);
            divEntry.appendChild(btnCancel);
        }

        main.appendChild(divEntry);
    }
}
