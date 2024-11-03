function onEnable2FA() {
    console.log("fetch")
    fetch("/api/Auth/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getJwtHeader(getJwtToken())
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            displayQrCode(data);
        })
        .catch((error) => {
            showError(error);
        });
}

function showError(errorText) {
    toastr.error(
        '2FA',
        'errorText',
        {
            timeOut: 2000,
            fadeOut: 1000,
            onHidden: function () {
                window.location.href = "index.html";
            }
        }
    )
}

function displayQrCode(data) {
    var infoLabel = document.createElement('label');
    infoLabel.innerText = 'Please scan this with your authenticator app';

    var divLabel = document.createElement('div');
    divLabel.appendChild(infoLabel);

    var image = document.createElement('img');
    image.src = data.qrCodeSetupImageUrl;
    image.width = 300;
    image.height = 300;

    var divQrCode = document.createElement('div');
    divQrCode.appendChild(image);

    var main = document.getElementById('main');
    main.appendChild(divLabel);
    main.appendChild(divQrCode);
}

function createEnable2FAForm() {
    /* Title. */
    var mainTitle = document.createElement('h1');
    mainTitle.innerText = 'Enable 2FA';

    var main = document.getElementById('main');
    main.innerHTML = '';
    main.appendChild(mainTitle);

    /* Enable button. */
    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Enable';

    var divButton = document.createElement('div');
    divButton.innerHTML += '<br>';
    divButton.appendChild(submitButton);

    /* Login form. */
    var enableForm = document.createElement('form');
    enableForm.id = 'enableForm';
    enableForm.action = 'javascript:onEnable2FA()';
    enableForm.appendChild(divButton);

    main.appendChild(enableForm);
}