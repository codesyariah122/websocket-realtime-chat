from flask import render_template, request, redirect, session, flash
from sockets import socketio
from flask_socketio import emit
from . import auth_bp
from models.user import User
from models import db

@auth_bp.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        nickname = request.form.get("nickname", "").strip()

        # Validasi input tidak boleh kosong
        if not nickname:
            flash("Nickname tidak boleh kosong!", "error")
            return render_template("login.html")

        # Validasi minimal 3 karakter
        if len(nickname) < 3:
            flash("Nickname harus minimal 3 karakter!", "error")
            return render_template("login.html")

        # Validasi hanya boleh huruf, angka, dan underscore
        if not nickname.isalnum() and "_" not in nickname:
            flash("Nickname hanya boleh huruf, angka, dan underscore!", "error")
            return render_template("login.html")

        # Cek apakah user terdaftar
        user = User.query.filter_by(nickname=nickname).first()
        if not user:
            flash("Nickname tidak ditemukan! Silakan daftar terlebih dahulu.", "error")
            return render_template("login.html")

        # Login berhasil
        session["nickname"] = nickname
        # socketio.emit("user_joined", {"nickname": nickname}, to="all")
        print(f"DEBUG: Mengirim event user_joined untuk {nickname}")
        # socketio.emit("user_joined", {"nickname": nickname}, room="all")
        socketio.emit("user_joined", {"nickname": nickname})

        # Jika admin, arahkan ke /admin
        if nickname in ["admin001", "admin212"]:
            return redirect("/admin")

        return redirect("/chat")

    return render_template("login.html")


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        nickname = request.form["nickname"]
        if User.query.filter_by(nickname=nickname).first():
            return "Nickname sudah digunakan!"
        new_user = User(nickname=nickname)
        db.session.add(new_user)
        db.session.commit()
        return redirect("/")
    return render_template("register.html")

@auth_bp.route("/logout")
def logout():
    session.pop("nickname", None)
    return redirect("/")

@socketio.on("user_login")
def handle_user_login(data):
    nickname = data.get("nickname")
    print(f"User {nickname} logged in")

    # Broadcast ke semua user bahwa ada user baru yang login
    socketio.emit("user_joined", {"nickname": nickname}, broadcast=True)
