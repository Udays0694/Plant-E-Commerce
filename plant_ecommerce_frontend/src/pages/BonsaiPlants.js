// src/pages/BonsaiPlants.js
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProductsByCategory } from '../services/api';

const BonsaiPlants = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductsByCategory(5); // Category 5 = Bonsai
                setProducts(data);
            } catch (error) {
                console.error('Failed to load bonsai plants:', error);
            }
        };
        loadProducts();
    }, []);

    return (
        <div>
            <h2>Bonsai Plants</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default BonsaiPlants;
