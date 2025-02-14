from flask import render_template, session, redirect, jsonify
from . import admin_bp
from models.message import Message
from models.message import Message, db 


@admin_bp.route("/admin")
def admin():
    if "nickname" not in session or session["nickname"] not in ["admin001", "admin212"]:
        return redirect("/")
    messages = Message.query.all()
    return render_template("admin.html", messages=messages, nickname=session["nickname"])

@admin_bp.route("/delete_chat/<nickname>", methods=["DELETE"])
def delete_chat(nickname):
    if "nickname" not in session or session["nickname"] not in ["admin001", "admin212"]:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        messages = Message.query.filter(
            (Message.sender == nickname) | (Message.receiver == nickname)
        ).all()
        if not messages:
            return jsonify({"error": "Chat tidak ditemukan"}), 404

        db.session.query(Message).filter(
            (Message.sender == nickname) | (Message.receiver == nickname)
        ).delete(synchronize_session=False)
        db.session.commit()

        return jsonify({"success": True, "message": f"Chat dengan {nickname} telah dihapus"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    
    
@admin_bp.route("/chat_history/<nickname>")
def get_chat_history(nickname):
    if "nickname" not in session or session["nickname"] not in ["admin001", "admin212"]:
        return jsonify({"error": "Unauthorized"}), 403

    messages = Message.query.filter(
        (Message.sender == nickname) | (Message.receiver == nickname)
    ).all()

    history = [{"sender": m.sender, "receiver": m.receiver, "text": m.text} for m in messages]
    return jsonify(history)
