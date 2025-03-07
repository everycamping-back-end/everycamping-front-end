import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSellerProductDetail } from '../../api/productsService';
import useProducts from '../../hooks/useProducts';

type ProductUpdateFormProps = {
  productId: string;
};

export default function ProductUpdateForm({
  productId,
}: ProductUpdateFormProps) {
  const navigate = useNavigate();
  const { data: sellerProduct } = useQuery(
    ['sellerProduct', productId],
    () => getSellerProductDetail(productId),
    { staleTime: 1000 * 60 * 5 }
  );
  const [image, setImage] = useState<File>();
  const [detailImage, setDetailImage] = useState<File>();
  const [updatedProduct, setUpdatedProduct] = useState({
    category: '',
    name: '',
    price: 0,
    stock: 0,
    description: '',
    onSale: true,
    tags: [''],
  });
  const { updateProductMutation } = useProducts();

  useEffect(() => {
    sellerProduct &&
      setUpdatedProduct({
        category: sellerProduct.category,
        name: sellerProduct.name,
        price: sellerProduct.price,
        stock: sellerProduct.stock,
        description: sellerProduct.description,
        onSale: sellerProduct.onSale,
        tags: sellerProduct.tags,
      });
  }, [sellerProduct]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const { files } = e.target as HTMLInputElement;
    if (name === 'image') {
      setImage((files as FileList)[0]);
      return;
    }
    if (name === 'detailImage') {
      setDetailImage((files as FileList)[0]);
      return;
    }
    setUpdatedProduct((product) => {
      if (name === 'onSale') {
        return { ...product, onSale: !product.onSale };
      }
      if (name === 'tags') {
        console.log(value);

        return { ...product, tags: value.split(',') };
      }
      return { ...product, [name]: value };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProductMutation.mutate(
      { productId, updatedProduct, image, detailImage },
      { onSuccess: () => navigate('/mypage/products') }
    );
  };

  return (
    <form className='flex flex-col gap-3 items-center' onSubmit={handleSubmit}>
      <select
        className='select w-full max-w-xs bg-white'
        name='category'
        onChange={handleChange}
        value={updatedProduct.category ?? 'category'}
        required
      >
        <option disabled value='category'>
          카테고리
        </option>
        <option value='TENT'>Tent</option>
        <option value='COOK'>Cook</option>
        <option value='ACCESSORY'>Accessory</option>
      </select>
      <input
        type='text'
        name='name'
        value={updatedProduct.name ?? ''}
        placeholder='제품명'
        className='input w-full max-w-xs bg-white'
        onChange={handleChange}
        required
      />
      <label className='input-group w-full max-w-xs'>
        <span className='w-20 justify-center'>가격</span>
        <input
          type='number'
          name='price'
          value={updatedProduct.price ?? ''}
          min='0'
          className='input bg-white w-full'
          onChange={handleChange}
          required
        />
      </label>
      <label className='input-group w-full max-w-xs'>
        <span className='w-20 justify-center'>수량</span>
        <input
          type='number'
          name='stock'
          value={updatedProduct.stock ?? ''}
          min='0'
          className='input bg-white w-full'
          onChange={handleChange}
          required
        />
      </label>
      <input
        type='text'
        name='tags'
        value={updatedProduct.tags ?? ''}
        placeholder='태그(텐트,캠핑)'
        className='input w-full max-w-xs bg-white'
        onChange={handleChange}
      />
      <span>대표이미지</span>
      <input
        type='file'
        name='image'
        className='file-input w-full max-w-xs bg-white'
        accept='image/*'
        onChange={handleChange}
      />
      <textarea
        name='description'
        value={updatedProduct.description ?? ''}
        className='textarea w-full max-w-xs bg-white text-base'
        placeholder='제품설명'
        onChange={handleChange}
        required
      ></textarea>
      <span>상세이미지</span>
      <input
        type='file'
        name='detailImage'
        className='file-input w-full max-w-xs bg-white'
        accept='image/*'
        onChange={handleChange}
      />
      <label className='label cursor-pointer'>
        <span className='label-text mr-2'>판매</span>
        <input
          type='checkbox'
          className='checkbox checkbox-primary'
          name='onSale'
          onChange={handleChange}
          checked={updatedProduct.onSale}
          required
        />
      </label>
      <button type='submit' className='btn btn-wide btn-primary mt-3'>
        수정완료
      </button>
    </form>
  );
}
