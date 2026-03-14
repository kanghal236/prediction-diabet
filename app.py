from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import os

# ✅ Forcer Flask à trouver les bons dossiers
base_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__,
            template_folder=os.path.join(base_dir, "templates"),
            static_folder=os.path.join(base_dir, "static"))

# Charger le modèle
model = joblib.load(os.path.join(base_dir, "model", "modele_svm.pkl"))

print("✅ Modèle chargé avec succès !")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        features = np.array(data["features"]).reshape(1, -1)
        prediction = model.predict(features)
        return jsonify({
            "success": True,
            "prediction": prediction.tolist()[0]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)