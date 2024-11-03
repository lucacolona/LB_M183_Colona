function handleCancelNew(newsEntry) {
    window.location.href = "index.html";
}

function handleSaveNew() {
    var headerElement = document.getElementById("header");
    var detailElement = document.getElementById("detail");

    var data = {
        header: headerElement.innerText,
        detail: detailElement.innerText,
        authorId: getUserid(),
        isAdminNews: isAdmin()
    }

    fetch("/api/News/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getJwtHeader(getJwtToken())
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = "index.html";
            }
            else {
                alert("NOK");
            }
        })
        .catch(() => {
            alert("Error");
        });
}

function createNews(data) {
    /* Header. */
    var mainTitle = document.createElement("h1");
    mainTitle.innerText = "New entry";

    var main = document.getElementById("main");
    main.appendChild(mainTitle);

    /* New entry. */
    var divEntry = document.createElement("div");
    divEntry.classList.add("newsEntry");

    var header = document.createElement("div");
    header.id = "header";
    header.classList.add("newsHeader");
    if (isAdmin()) {
        header.classList.add("adminNews");
    }
    header.innerText = "New header";
    header.contentEditable = true;

    var detail = document.createElement("div");
    detail.id = "detail";
    detail.classList.add("newsDetail");
    detail.innerText = "New detail";
    detail.contentEditable = true;

    var btnSave = document.createElement("button");
    btnSave.id = "btnSave";
    btnSave.classList.add("btnSave");
    btnSave.innerText = "Save";

    (function (arg) {
        btnSave.addEventListener("click", function () {
            handleSaveNew(arg);
        });
    })();

    var btnCancel = document.createElement("button");
    btnCancel.id = "btnCancel";
    btnCancel.classList.add("btnCancel");
    btnCancel.innerText = "Cancel";

    (function (arg) {
        btnCancel.addEventListener("click", function () {
            handleCancelNew(arg);
        });
    })();

    divEntry.appendChild(header);
    divEntry.appendChild(detail);
    divEntry.appendChild(btnSave);
    divEntry.appendChild(btnCancel);
    main.appendChild(divEntry);
}
