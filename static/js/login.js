document
    .getElementById("nickname")
    .addEventListener("input", function () {
        let flashMessage = document.getElementById("flash-message");
        if (flashMessage) {
            flashMessage.style.display = "none";
        }
    });

function validateForm() {
    let nickname = document.getElementById("nickname").value.trim();
    let errorMessage = document.getElementById("error-message");

    if (nickname === "") {
        errorMessage.textContent = "Nickname tidak boleh kosong!";
        errorMessage.classList.remove("hidden");
        return false;
    }

    if (nickname.length < 3) {
        errorMessage.textContent = "Nickname harus minimal 3 karakter!";
        errorMessage.classList.remove("hidden");
        return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
        errorMessage.textContent =
            "Nickname hanya boleh huruf, angka, dan underscore!";
        errorMessage.classList.remove("hidden");
        return false;
    }

    errorMessage.classList.add("hidden");
    return true;
}