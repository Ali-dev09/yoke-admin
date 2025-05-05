import { backendUrl } from '../constants.js';
import { useState, useEffect } from 'react';
import '../styles/products.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const categories = [
  'ادوات احتياطية مولدات',
  'ادوات احتياطية 5 كي في',
  'ادوات احتياطية كامة',
  'ادوات احتياطية زراعي',
  'ادوات احتياطية حاشوشة',
  'ادوات احتياطية ميشار',
  'ماطور غسالة',
  'ماطور ماء',
  'أخرى',
  'ادوات احتياطية كاملة'
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = localStorage.getItem('token');
if (!token) {
  navigate('/');
  return;
}

const response = await axios.get(`${backendUrl}/admin/products`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = response.data;
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryToFilter = customCategory || selectedCategory;

    if (categoryToFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p => p.category === categoryToFilter)
      );
    }
  }, [selectedCategory, customCategory, products]);

  if (loading) return <p className="message">جارٍ التحميل...</p>;
  if (error) return <p className="message">حدث خطأ: {error}</p>;

  function handleReadMore(id) {
    const encodedId = encodeURIComponent(id);
    navigate(`/product/${encodedId}`);
  }


  return (
    <div className="products-container">
      <h2 className="products-heading">قائمة المنتجات</h2>

      <div className="category-filter">
        <label htmlFor="categorySelect">اختر فئة:</label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCustomCategory('');
          }}
        >
          <option value="all">الكل</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

       
        
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => handleReadMore(product._id)}
          >
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">
              الفئة: {product.category || 'غير محددة'}
            </p>
          </div>
        ))}
        <button className='button' onClick={() => {navigate('/home')}}>home</button>
      </div>
    </div>
  );
}
