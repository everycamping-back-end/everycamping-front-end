import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postOrders } from '../../api/orderService';
import { cartContentType } from '../../pages/Cart';
import AddressSearch from './AddressSearch';
import OrderFormItemCard from './OrderFormItemCard';
import { useUserInfo } from '../../store/UserInfoProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastError, toastSuccess, toastWarn } from '../../util/reactToast';

export type OrderInfo = {
  name: string;
  phone: string;
  address: string;
  request: string;
};

const OrderFormComp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice, orderItems } = location.state;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const orderDetailRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useUserInfo();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: '',
    phone: '',
    address: '',
    request: '',
  });
  const [orderProductFormList, setOrderProductFormList] = useState<object[]>(
    []
  );

  const onChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'user') {
      setOrderInfo((prev) => ({
        ...prev,
        name: userInfo.nickName,
        phone: userInfo.phoneNumber,
      }));
    }
    setOrderInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    const result = orderItems.reduce((acc: object[], cur: cartContentType) => {
      return [
        ...acc,
        {
          productId: cur.productId,
          quantity: cur.quantity,
        },
      ];
    }, []);
    setOrderProductFormList(result);
  }, []);

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (orderInfo.address === '') {
        return toastWarn('주소를 입력하세요');
      }
      await postOrders({
        name: orderInfo.name,
        phone: orderInfo.phone,
        address: orderInfo.address,
        request: orderInfo.request,
        orderProductFormList,
      }).then(() => {
        toastSuccess('주문이 완료 되었습니다.');
        navigate('/mypage/user/orders');
      });
    } catch (error) {
      console.error(error);
      if (error === 'PRODUCT_NOT_ON_SALE')
        return toastError('판매가 종료된 상품이 있습니다.');
      if (error === 'PRODUCT_NOT_ENOUGH_STOCK')
        return toastError('주문한 상품의 재고가 부족 합니다.');
    }
  };

  return (
    <form onSubmit={(e) => formSubmit(e)}>
      <div className='flex flex-col mt-10'>
        <div className='form-control'>
          <label className='label cursor-pointer justify-start'>
            <input
              type='checkbox'
              className='checkbox mr-1'
              name='user'
              onChange={(e) => onChange(e)}
            />
            <span>주문자와 일치</span>
          </label>
          <label className='input-group'>
            <span className='justify-center min-w-74px whitespace-nowrap'>
              수령인
            </span>
            <input
              className='input input-bordered w-full text-lg bg-white focus:outline-none'
              type='text'
              name='name'
              placeholder='이름'
              onChange={(e) => onChange(e)}
              value={orderInfo.name}
              required
              autoComplete='off'
            />
          </label>
        </div>
      </div>
      <div className='form-control mt-3'>
        <label className='input-group'>
          <span className='justify-center min-w-74px whitespace-nowrap'>
            연락처
          </span>
          <input
            className='input input-bordered w-full text-lg bg-white focus:outline-none'
            name='phone'
            type='tel'
            placeholder='연락처'
            value={orderInfo.phone}
            required
            autoComplete='off'
            pattern='[0,1]{3}-[0-9]{4}-[0-9]{4}'
            onChange={(e) => onChange(e)}
          />
        </label>
      </div>
      <AddressSearch setOrderInfo={setOrderInfo} />
      <div className='flex flex-col mt-3'>
        <div className='form-control'>
          <label className='input-group'>
            <span className='justify-center min-w-74px whitespace-nowrap'>
              주문 정보
            </span>
            <div
              className='input input-bordered w-full bg-white min-h-50px h-fit p-3 focus:outline-none'
              ref={orderDetailRef}
            >
              {orderItems.map((item: cartContentType, idx: number) => {
                return idx !== orderItems.length - 1 ? (
                  <OrderFormItemCard
                    key={item.productId}
                    title={item.name}
                    count={item.quantity}
                    price={item.price}
                  />
                ) : (
                  <OrderFormItemCard
                    key={item.productId}
                    title={item.name}
                    count={item.quantity}
                    price={item.price}
                    last='last'
                  />
                );
              })}
            </div>
          </label>
        </div>
      </div>
      <div className='flex flex-col mt-3'>
        <div className='form-control'>
          <label className='input-group'>
            <span className='justify-center min-w-74px whitespace-nowrap'>
              요청 사항
            </span>
            <textarea
              className='input input-bordered pt-2 w-full text-lg bg-white focus:outline-none h-fit'
              name='request'
              value={orderInfo.request}
              ref={textareaRef}
              onChange={(e) => {
                onChange(e);
                handleResizeHeight();
              }}
            />
          </label>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <tbody>
            <tr>
              <th>총 금액</th>
              <td className='text-right'>{totalPrice.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-center mt-10'>
        <button className='w-24 p-2 btn btn-primary' type='submit'>
          결제하기
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default OrderFormComp;
