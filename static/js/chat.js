let socket = io(),
    chatBox = document.getElementById("chat-box");

socket.on("chat_message", function (msg) {
    let div = document.createElement("div");
    div.classList.add(
        "message",
        msg.sender === nickname ? "user" : "admin"
    );
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
    let message = document.getElementById("message").value;
    if (!message.trim()) return;
    socket.emit("chat_message", { sender: nickname, text: message });
    document.getElementById("message").value = "";
}

function loadChatHistory() {
    fetch("/chat/history")
        .then((response) => response.json())
        .then((messages) => {
            chatBox.innerHTML = "";
            messages.forEach((msg) => {
                var div = document.createElement("div");
                div.classList.add(
                    "message",
                    msg.sender === nickname ? "user" : "admin"
                );
                div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
                chatBox.appendChild(div);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch((error) =>
            console.error("Error loading chat history:", error)
        );
}
document.addEventListener("DOMContentLoaded", loadChatHistory);

function leaveChat() {
    fetch("/logout")
        .then(() => {
            window.location.href = "/";
        })
        .catch((error) => console.error("Error:", error));
}

document.getElementById("message").addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
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