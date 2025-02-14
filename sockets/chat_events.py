import json
from flask import session, request
from flask_socketio import emit, join_room, leave_room
from . import socketio
from models import db
from models.message import Message

connected_users = {}

@socketio.on("connect")
def handle_connect():
    if "nickname" in session:
        connected_users[session["nickname"]] = request.sid
        join_room(session["nickname"])
        emit("update_active_users", list(connected_users.keys()), broadcast=True)

@socketio.on("disconnect")
def handle_disconnect():
    if "nickname" in session and session["nickname"] in connected_users:
        del connected_users[session["nickname"]]
        emit("update_active_users", list(connected_users.keys()), broadcast=True)

@socketio.on("chat_message")
def handle_chat_message(data):
    sender = session.get("nickname")
    
    if not isinstance(data, dict):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            print("Invalid JSON format")
            return

    text = data.get("text")
    receiver = data.get("receiver")

    if not text:
        return

    print(f"Pesan diterima: {sender} -> {receiver}: {text}")  # Debugging

    try:
        new_msg = Message(sender=sender, receiver=receiver, text=text)
        db.session.add(new_msg)
        db.session.commit()
        print("Pesan berhasil disimpan ke database")  # Debugging
    except Exception as e:
        print(f"Error menyimpan pesan: {e}")
        db.session.rollback()

    if receiver and receiver in connected_users:
        emit("chat_message", {"sender": sender, "receiver": receiver, "text": text}, room=connected_users[receiver])
    else:
        emit("chat_message", {"sender": sender, "text": text}, broadcast=True)


@socketio.on("delete_chat")
def handle_delete_chat(data):
    if "nickname" not in session or session["nickname"] not in ["admin001", "admin212"]:
        return

    nickname = data.get("nickname")
    if not nickname:
        return

    try:
        Message.query.filter((Message.sender == nickname) | (Message.receiver == nickname)).delete()
        db.session.commit()

        emit("chat_deleted", {"nickname": nickname}, broadcast=True)
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting chat history: {e}")
        
