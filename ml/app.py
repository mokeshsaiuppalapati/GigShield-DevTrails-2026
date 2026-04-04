from flask import Flask, request, jsonify
from sklearn.tree import DecisionTreeRegressor
import numpy as np

app = Flask(__name__)

# Dummy training data
# Features: [zone_risk, season]
X = np.array([
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2]
])

# Output: risk factor
y = np.array([0.9, 1.0, 1.2, 1.0, 1.1, 1.3])

model = DecisionTreeRegressor()
model.fit(X, y)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    zone_risk = data["zone_risk"]
    season = data["season"]

    prediction = model.predict([[zone_risk, season]])

    return jsonify({
        "risk_factor": float(prediction[0])
    })

if __name__ == "__main__":
    app.run(port=5000)