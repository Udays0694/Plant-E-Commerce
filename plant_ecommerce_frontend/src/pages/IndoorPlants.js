// src/pages/IndoorPlants.js
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProductsByCategory } from '../services/api';

const IndoorPlants = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductsByCategory(1); // Category 1 = Indoor
                setProducts(data);
            } catch (error) {
                console.error('Failed to load indoor plants:', error);
            }
        };
        loadProducts();
    }, []);

    return (
        <div>
            <h2>Indoor Plants</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default IndoorPlants;

