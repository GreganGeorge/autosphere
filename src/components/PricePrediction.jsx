import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const PricePrediction = () => {
    const [formData, setFormData] = useState({
        year: '',
        km_driven: '',
        fuel: '',
        seller_type: '',
        transmission: '',
        owner: '',
        mileage: '',
        engine: '',
        seats: '',
        brand: '',
        model: ''
    });

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/data')
            .then(response => response.json())
            .then(data => {
                setBrands(data.brands); 
                setModels(data.models);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBrandChange = (selectedOption) => {
        setFormData({ ...formData, brand: selectedOption.value });
    };

    const handleModelChange = (selectedOption) => {
        setFormData({ ...formData, model: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setPrediction(data.predicted_price);
            } else {
                alert('Failed to get prediction');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div className='mt-40 max-w-[800px] mx-auto'>
            <h1 className="text-4xl font-semibold mb-10 text-center">Used Car Price Prediction</h1>
            <div className="mb-4">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                <Select
                    options={brands.map(brand => ({ label: brand.name, value: brand.id }))}
                    onChange={handleBrandChange}
                    placeholder="Select Brand"
                    isSearchable
                    className="block w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                <Select
                    options={models.map(model => ({ label: model.name, value: model.id }))}
                    onChange={handleModelChange}
                    placeholder="Select Model"
                    isSearchable
                    className="block w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="km_driven" className="block text-sm font-medium text-gray-700">KM Driven</label>
                <input
                    id="km_driven"
                    name="km_driven"
                    type="number"
                    value={formData.km_driven} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage</label>
                <input
                    id="mileage"
                    name="mileage"
                    type="number"
                    value={formData.mileage} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Engine (in CC)</label>
                <input
                    id="engine"
                    name="engine"
                    type="number"
                    value={formData.engine} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700">Seats</label>
                <input
                    id="seats"
                    name="seats"
                    type="number"
                    value={formData.seats} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="fuel" className="block text-sm font-medium text-gray-700">Fuel Type</label>
                <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                    <option value="">Select Fuel Type</option>
                    <option value="1">Diesel</option>
                    <option value="2">Petrol</option>
                    <option value="3">LPG</option>
                    <option value="4">CNG</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="seller_type" className="block text-sm font-medium text-gray-700">Seller Type</label>
                <select
                    name="seller_type"
                    value={formData.seller_type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                    <option value="">Select Seller Type</option>
                    <option value="1">Individual</option>
                    <option value="2">Dealer</option>
                    <option value="3">Trustmark Dealer</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
                <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                    <option value="">Select Transmission</option>
                    <option value="1">Manual</option>
                    <option value="2">Automatic</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</label>
                <select
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                    <option value="">Select Owner</option>
                    <option value="1">First Owner</option>
                    <option value="2">Second Owner</option>
                    <option value="3">Third Owner</option>
                    <option value="4">Fourth & Above Owner</option>
                    <option value="5">Test Drive Car</option>
                </select>
            </div>

            <button
                className="w-full mb-20 mt-10 px-4 py-2 text-base font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleSubmit}
            >
                Predict
            </button>
            {prediction && (
                <div className="mb-40 p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">Predicted Price</h2>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                        ₹ {prediction.toFixed(2)}
                    </p>
                </div>
            )}
        </div>
    );
}

export default PricePrediction;
