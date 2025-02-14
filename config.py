'''
@author: Puji Ermanto <pujiermanto@gmail.com>
@return DB
'''

import os
from dotenv import load_dotenv

# Memuat variabel dari file .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() in ('true', '1')
