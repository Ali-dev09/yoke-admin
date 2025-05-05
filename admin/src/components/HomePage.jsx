import '../styles/HomePage.css';
import {useNavigate} from 'react-router-dom' 
export default function HomePage() {
  const navigate = useNavigate()
  function handelNavigate(path){
    navigate(`/${path}`)
  }
  return (
    <div className="homepage-container">
      <div className="square add" onClick={() => {handelNavigate('add')}}>اضافة منتجات </div>
      <div className="square edit" onClick={() => {handelNavigate('products')}}> تعديل المنتجات الحالية</div>
    </div>
  );
}
