var socket = io();
var chatBox = document.getElementById("chat-box");
var nickname = "{{ nickname }}";

socket.on("chat_message", function (msg) {
    var div = document.createElement("div");
    div.classList.add(
        "message",
        msg.sender === nickname ? "user" : "admin"
    );
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
    var message = document.getElementById("message").value;
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