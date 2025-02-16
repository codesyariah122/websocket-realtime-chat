import { EmojiButton } from "https://unpkg.com/@joeattardi/emoji-button@4.6.2/dist/index.js";

document.addEventListener("DOMContentLoaded", () => {
    const picker = new EmojiButton();
    const emojiButton = document.getElementById("emoji-button");
    const messageInput = document.getElementById("message");

    emojiButton.addEventListener("click", () => {
        picker.togglePicker(emojiButton);
    });

    picker.on("emoji", (selection) => {
        messageInput.value += selection.emoji;
        messageInput.focus();
    });
});