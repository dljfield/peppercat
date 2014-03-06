from app import app
from flask import render_template, send_from_directory

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/scene/<path:scene>')
def scene(scene):
	return send_from_directory(app.config['SCENES'], scene + '.json')
