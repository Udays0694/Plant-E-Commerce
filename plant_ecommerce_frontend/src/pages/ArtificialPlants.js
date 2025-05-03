// src/pages/ArtificialPlants.js
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProductsByCategory } from '../services/api';

const ArtificialPlants = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductsByCategory(3); // Category 3 = Artificial
                setProducts(data);
            } catch (error) {
                console.error('Failed to load artificial plants:', error);
            }
        };
        loadProducts();
    }, []);

    return (
        <div>
            <h2>Artificial Plants</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ArtificialPlants;
