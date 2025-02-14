from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
chat_bp = Blueprint('chat', __name__)
admin_bp = Blueprint('admin', __name__)

from . import auth, chat, admin
