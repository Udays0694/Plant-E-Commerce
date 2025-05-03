// src/pages/AquaticPlants.js
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProductsByCategory } from '../services/api';

const AquaticPlants = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductsByCategory(4); // Category 4 = Aquatic
                setProducts(data);
            } catch (error) {
                console.error('Failed to load aquatic plants:', error);
            }
        };
        loadProducts();
    }, []);

    return (
        <div>
            <h2>Aquatic Plants</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default AquaticPlants;
