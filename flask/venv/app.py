from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
with open('xgb_model.pkl', 'rb') as f:
    model = pickle.load(f)

data = pd.read_csv('car details v3.csv') 
data.drop(columns=['torque','max_power'],inplace=True)
data.dropna(inplace=True)
data.drop_duplicates(inplace=True)
data['brand'] = data['name'].apply(lambda x: x.split(' ')[0])

data['model'] = data['name'].apply(lambda x: ' '.join(x.split(' ')[1:]))

unique_brands = data['brand'].unique()
unique_models = data['model'].unique()

brands = [{'id': idx + 1, 'name': brand} for idx, brand in enumerate(unique_brands)]
models = [{'id': idx + 1, 'name': model} for idx, model in enumerate(unique_models)]

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify({
        'brands': brands,
        'models': models
    })

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json(force=True)
    required_fields = ['year', 'km_driven', 'fuel', 'seller_type', 'transmission', 'owner', 'mileage', 'engine', 'seats', 'brand', 'model']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing data fields'}), 400
    try:
        input_data = pd.DataFrame({
            'year': [int(data['year'])],
            'km_driven': [int(data['km_driven'])],
            'fuel': [int(data['fuel'])],
            'seller_type': [int(data['seller_type'])],
            'transmission': [int(data['transmission'])],
            'owner': [int(data['owner'])],
            'mileage': [float(data['mileage'])],
            'engine': [int(data['engine'])],
            'seats': [int(data['seats'])],
            'brand': [data['brand']], 
            'model': [data['model']]  
        })
        prediction = model.predict(input_data)
        return jsonify({'predicted_price': prediction.tolist()[0]})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
