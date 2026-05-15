import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

INPUT_PATH = 'c:/Users/jangi/OneDrive/Pictures/Documents/AI-Smart-Food-Redistribution (2)/projeect/ai/dataset/food_waste_data.csv'
OUTPUT_PATH = 'c:/Users/jangi/OneDrive/Pictures/Documents/AI-Smart-Food-Redistribution (2)/projeect/ai/models/surplus_predictor.pkl'

if __name__ == '__main__':
    df = pd.read_csv(INPUT_PATH)
    X = df[['expectedGuests', 'foodType', 'freshnessHours']]
    y = df['surplusEstimate']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # Create models directory if it doesn't exist
    import os
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    joblib.dump(model, OUTPUT_PATH)
    print(f'Model training complete. Score: {model.score(X_test, y_test):.4f}')
    print('Model saved to', OUTPUT_PATH)
