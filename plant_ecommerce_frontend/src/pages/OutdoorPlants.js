// src/pages/OutdoorPlants.js
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProductsByCategory } from '../services/api';

const OutdoorPlants = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductsByCategory(2); // Category 2 = Outdoor
                setProducts(data);
            } catch (error) {
                console.error('Failed to load artificial plants:', error);
            }
        };
        loadProducts();
    }, []);

    return (
        <div>
            <h2>Outdoor Plants</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default OutdoorPlants;
