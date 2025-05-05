import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants.js';
import '../styles/edit.css';

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

export default function Edit() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    origin: '',
    hasSizes: false,
    sizes: [],
    stock: 'true'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false); // ← New state

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${backendUrl}/product/${productId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product.');
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, '']
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // ← Show "جاري التعديل..."

    try {
      await axios.put(`${backendUrl}/product/${productId}`, formData);
      alert('تم تحديث المنتج بنجاح');
      navigate('/products');
    } catch (err) {
      alert('حدث خطأ أثناء تحديث المنتج');
    } finally {
      setSubmitting(false); // ← Reset after submission
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="add-container" dir="rtl">
      <h2>تعديل المنتج</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>اسم المنتج:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>السعر:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الوصف:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الصورة:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.image && (
            <img 
              src={formData.image} 
              alt="Product preview" 
              style={{ width: '200px', marginTop: '10px' }}
            />
          )}
        </div>

        <div className="form-group">
          <label>بلد المنشأ:</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>الفئة:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">اختر فئة</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="hasSizes"
              checked={formData.sizes.length >0}
              onChange={handleChange}
            />
            يحتوي على مقاسات
          </label>
        </div>

        {formData.hasSizes && (
          <div className="sizes-container">
            {formData.sizes.map((size, index) => (
              <div key={index} className="size-input">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  placeholder="أدخل المقاس"
                />
                <button type="button" onClick={() => removeSize(index)}>
                  حذف
                </button>
              </div>
            ))}
            <button type="button" onClick={addSize}>
              إضافة مقاس
            </button>
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="stock"
              checked={formData.stock === 'true'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                stock: e.target.checked ? 'true' : 'false'
              }))}
            />
            متوفر في المخزن
          </label>
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'جاري التعديل...' : 'حفظ التغييرات'}
        </button>
      </form>

      <button type="button" onClick={() => navigate('/home')}>
        الصفحة الرئيسية
      </button>
    </div>
  );
}
