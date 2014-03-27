from peppercat import app, db, models
with app.app_context():
	db.create_all()