import joblib
import pandas as pd

MODEL_PATH = '../models/surplus_predictor.pkl'

class SurplusPredictor:
    def __init__(self):
        self.model = joblib.load(MODEL_PATH)

    def predict(self, expected_guests, food_type, freshness_hours):
        data = pd.DataFrame([
            {
                'expectedGuests': expected_guests,
                'foodType': food_type,
                'freshnessHours': freshness_hours,
            }
        ])
        return self.model.predict(data)[0]
