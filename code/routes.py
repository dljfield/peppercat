from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder = 'client')

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/scene/<path:scene>')
def scene(scene):
	return send_from_directory('client/data', scene + '.json')

if __name__ == '__main__':
	app.run(debug=True)