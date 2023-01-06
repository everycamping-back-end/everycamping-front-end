import { ProductType } from '../pages/Products';

type ProductCardProps = {
  product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, imagePath } = product;
  return (
    <li className='card bg-base-100 shadow-xl hover:cursor-pointer hover:brightness-110 transition-all'>
      <figure>
        <img className='object-cover w-full h-56' src={imagePath} alt={name} />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{name}</h2>
        <p>{price.toLocaleString()}원</p>
      </div>
    </li>
  );
}
