import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants.js';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/readMore.css';

export default function Product() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${backendUrl}/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  if (loading) return <p className="details-loading">...جار التحميل</p>;
  if (!product) return <p className="details-error">لم يتم العثور على المنتج</p>;

  const { image, description, hasSizes, sizes, stock, name } = product;

  const handleEditProduct = () => {
    navigate(`/edit/${productId}`); // Redirect to the edit page
  };


  async function  deleteProduct(){
    try{
      await axios.delete(`${backendUrl}/product/${productId}`)
      navigate('/products')
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className="details-product">
      {/* Image */}
      <div className="details-image">
        <img src={image || '/path/to/fallback-image.jpg'} alt="Product" />
      </div>

      {/* Description */}
      <div className="details-description">
        <h2 dir="rtl">الوصف</h2>
        <p dir="rtl">{description}</p>
      </div>

      {/* Sizes */}
      {hasSizes && (
        <div className="details-sizes" dir="rtl">
          <h3>المقاسات المتوفرة:</h3>
          <ul>
            {sizes?.map((size, index) => (
              <li key={index}>{size}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stock Warning */}
      {stock === 'false' && (
        <div className="details-stock">
          <span className="details-stock-warning">غير متوفر</span>
        </div>
      )}

      {/* Edit Button (Always Visible) */}
      <div className="details-buttons" dir="rtl">
        <button 
          className="details-button edit-product" 
          onClick={handleEditProduct}
          style={{ backgroundColor: 'orange', border: "none", padding: "10px", borderRadius: "10px", cursor: 'pointer', color: 'white' }}
        >
          تعديل المنتج
        </button>
        <button className='button' onClick={deleteProduct}>
         حذف المنتج
        </button>
      </div>
    </div>
  );
}
