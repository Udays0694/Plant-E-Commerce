// src/components/AddProductForm.js
import React, { useState } from 'react';
import axios from '../services/api';

const AddProductForm = ({ categoryId }) => {
    const [formData, setFormData] = useState({
        general_name: '',
        scientific_name: '',
        brief_description: '',
        uses: '',
        cost: '',
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        for (const key in formData) {
            data.append(key, formData[key]);
        }
        data.append('category_id', categoryId); // set category automatically
        if (image) data.append('image', image);

        try {
            const res = await axios.post('/products/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(`Product added! ID: ${res.data.productId}`);
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            {message && <p>{message}</p>}
            <input name="general_name" placeholder="General Name" onChange={handleChange} required />
            <input name="scientific_name" placeholder="Scientific Name" onChange={handleChange} required />
            <input name="brief_description" placeholder="Brief Description" onChange={handleChange} required />
            <input name="uses" placeholder="Uses" onChange={handleChange} required />
            <input name="cost" type="number" placeholder="Cost" onChange={handleChange} required />
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProductForm;
