import React, { useState } from 'react';
import '../styles/Add.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {backendUrl} from '../constants.js'

function Add() {
  const url = backendUrl;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    origin: '',
    category: '',
    hasSizes: false,
    sizes: [],
    stock: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      handleImageChange(e);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, ''] });
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return alert('الرجاء إدخال اسم المنتج');
    if (!formData.price) return alert('الرجاء إدخال سعر المنتج');
    if (!formData.description.trim()) return alert('الرجاء إدخال وصف المنتج');
    if (!formData.image) return alert('الرجاء تحميل صورة للمنتج');
    if (!formData.category) return alert('الرجاء اختيار فئة المنتج');
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${url}/add/product`, formData);
      alert('تمت إضافة المنتج بنجاح!');
      setSuccess(true);
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        origin: '',
        category: '',
        hasSizes: false,
        sizes: [],
        stock: true
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المنتج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="heading">إضافة منتج</h2>

        <div>
          <label className="label">اسم المنتج:</label>
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">السعر (دينار عراقي):</label>
          <input
            className="input"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">الوصف:</label>
          <textarea
            className="input"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">الصورة:</label>
          <input
            className="input"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">بلد المنشأ:</label>
          <input
            className="input"
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">الفئة:</label>
          <select
            className="input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">اختر فئة المنتج</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <input
              type="checkbox"
              name="hasSizes"
              checked={formData.hasSizes}
              onChange={handleChange}
            />
            &nbsp;هل يحتوي على مقاسات؟
          </label>
        </div>

        {formData.hasSizes && (
          <div>
            <label className="label">المقاسات :</label>
            {formData.sizes.map((size, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  className="size-input"
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  placeholder="مثال: 10x20"
                />
                <button
                  type="button"
                  className="size-button"
                  onClick={() => removeSize(index)}
                >
                  حذف
                </button>
              </div>
            ))}
            <button type="button" className="size-button" onClick={addSize}>
              إضافة مقاس
            </button>
          </div>
        )}
      </form>

      <hr />
      <h2>معاينة المنتج</h2>
      <div dir="rtl" className="product-container">
        <div className="product">
          {formData.image && <img src={formData.image} alt="Product" />}
          <hr />
          <p className="product-name">{formData.name || 'اسم المنتج'}</p>
          <p className="product-price">السعر: {formData.price || '0'} دينار عراقي</p>
          <p className="product-description">{formData.description || 'لا يوجد وصف'}</p>
          <p className="product-origin">بلد المنشأ: {formData.origin || 'غير محدد'}</p>
          <p className="product-category">الفئة: {formData.category || 'غير محددة'}</p>
          {formData.hasSizes && formData.sizes.length > 0 && (
            <div>
              <h4>المقاسات:</h4>
              <ul>
                {formData.sizes.map((size, i) => (
                  <li key={i}>{size}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button onClick={handleSubmit} className="button" type="button" disabled={loading}>
          {loading ? 'جارٍ الإضافة...' : 'إضافة المنتج'}
        </button>
        <button
           className='button'
          style={{marginTop:'10px'}}
          onClick={() => {
       
          navigate('/products')
     
        }}>تصفح المنتجات</button>

      </div>
    </>
  );
}

export default Add;
