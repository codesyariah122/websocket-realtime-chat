from flask import render_template, session, redirect, jsonify
from . import chat_bp
from models import Message 

@chat_bp.route("/")
def chat():
    if "nickname" not in session:
        return redirect("/")
    return render_template("chat.html", nickname=session["nickname"])

@chat_bp.route("/history")
def chat_history():
    nickname = session.get("nickname")
    if not nickname:
        return jsonify([])

    messages = Message.query.filter((Message.sender == nickname) | (Message.receiver == nickname)).all()
    history = [{"sender": m.sender, "receiver": m.receiver, "text": m.text} for m in messages]
    return jsonify(history)
