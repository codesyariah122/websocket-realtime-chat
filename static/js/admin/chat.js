var socket = io();
var chatBox = document.getElementById("chat-box");
var receiverSelect = document.getElementById("receiver");

socket.on("update_active_users", function (users) {
    var userList = document.getElementById("user-list");
    userList.innerHTML = "";
    receiverSelect.innerHTML = '<option value="">Pilih User</option>';
    users.forEach((user) => {
        if (user !== nickname) {
            userList.innerHTML += `<li>${user}</li>`;
            receiverSelect.innerHTML += `<option value="${user}">${user}</option>`;
        }
    });
});

socket.on("chat_message", function (msg) {
    var div = document.createElement("div");
    div.classList.add(
        "message",
        msg.sender === nickname
            ? "user bg-blue-500 text-white text-right ml-auto"
            : "admin bg-red-500 text-white"
    );
    div.classList.add("p-2", "rounded-md", "mt-2", "max-w-[80%]");
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
    var message = document.getElementById("message").value;
    var receiver = receiverSelect.value;
    if (!message.trim() || !receiver) return;

    socket.emit("chat_message", {
        sender: nickname,
        text: message,
        receiver: receiver,
    });

    var div = document.createElement("div");
    div.classList.add(
        "message",
        "user",
        "bg-blue-500",
        "text-white",
        "p-2",
        "rounded-md",
        "mt-2",
        "text-right",
        "ml-auto",
        "max-w-[80%]"
    );
    div.innerHTML = `<strong>${nickname}:</strong> ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    document.getElementById("message").value = "";
}

function leaveChat() {
    fetch("/logout")
        .then(() => {
            window.location.href = "/";
        })
        .catch((error) => console.error("Error:", error));
}

function deleteChat() {
    var receiver = document.getElementById("receiver").value;
    if (!receiver) {
        alert("Pilih user terlebih dahulu!");
        return;
    }

    if (!confirm(`Hapus semua chat dengan ${receiver}?`)) return;

    fetch(`/delete_chat/${receiver}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(data.message);
                socket.emit("delete_chat", { nickname: receiver });
            } else {
                alert("Gagal menghapus chat: " + (data.error || "Unknown error"));
            }
        })
        .catch((error) => console.error("Error:", error));
}

socket.on("chat_deleted", function (data) {
    var chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
});

document
    .getElementById("receiver")
    .addEventListener("change", function () {
        var selectedUser = this.value;
        var chatBox = document.getElementById("chat-box");
        chatBox.innerHTML = "";
        if (!selectedUser) return;

        fetch(`/chat_history/${selectedUser}`)
            .then((response) => response.json())
            .then((messages) => {
                messages.forEach((msg) => {
                    var div = document.createElement("div");
                    div.classList.add(
                        "message",
                        ...(msg.sender === nickname
                            ? [
                                "user",
                                "bg-blue-500",
                                "text-white",
                                "text-right",
                                "ml-auto",
                            ]
                            : ["admin", "bg-red-500", "text-white"])
                    );
                    div.classList.add("p-2", "rounded-md", "mt-2", "max-w-[80%]");
                    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
                    chatBox.appendChild(div);
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            })
            .catch((error) =>
                console.error("Error fetching chat history:", error)
            );
    });


let notifSound = document.getElementById("notif-sound");
socket.off("chat_message");
socket.on("chat_message", function (msg) {
    let div = document.createElement("div");
    div.classList.add(
        "message",
        ...(msg.sender === nickname
            ? ["user", "bg-blue-500", "text-white", "text-right", "ml-auto"]
            : ["admin", "bg-red-500", "text-white"])
    );
    div.classList.add("p-2", "rounded-md", "mt-2", "max-w-[80%]");
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (msg.sender !== nickname) {
        notifSound.play();
    }
});

socket.on("user_joined", function (data) {
    console.log("User joined:", data.nickname);

    let loginSound = document.getElementById("login-sound");

    if (loginSound) {
        loginSound.play().catch((e) => {
            console.warn("Autoplay blocked, user interaction required:", e);
        });
    }

    let userList = document.getElementById("user-list");
    if (userList) {
        let newUser = document.createElement("li");
        newUser.textContent = data.nickname;
        userList.appendChild(newUser);
    }
});