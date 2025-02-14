'''
@author: Puji Ermanto <pujiermanto@gmail.com>
@return socket _
'''

import importlib
from flask import Flask, render_template
from config import Config
from models import db
from routes import auth_bp, chat_bp, admin_bp
from sockets import socketio
# import sockets.chat_events  # Import socket events
importlib.import_module("sockets.chat_events")

app = Flask(__name__)
app.config.from_object(Config)

# Inisialisasi database & socket
db.init_app(app)
socketio.init_app(app)

# Register Blueprint
app.register_blueprint(auth_bp)
# app.register_blueprint(chat_bp)
app.register_blueprint(chat_bp, url_prefix="/chat")
app.register_blueprint(admin_bp)

@app.route("/")
def home():
    return render_template("index.html")

# Buat database jika belum ada
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    socketio.run(app, debug=True)
