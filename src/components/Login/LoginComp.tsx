import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getSellerInfo,
  getUserInfo,
  postAdminLogin,
  postSellerLogin,
  postUserLogin,
} from '../../api/userService';
import { useUserInfo } from '../../store/UserInfoProvider';
import { toastError } from '../../util/reactToast';
import KakaoLogin from './socialLogin/KakaoLogin';

export type loginInfoType = {
  email: string;
  password: string;
};

const LoginComp = () => {
  const [loginInfo, setLoginInfo] = useState<loginInfoType>({
    email: '',
    password: '',
  });
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfo();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'seller') {
      setIsSeller((prev) => !prev);
      return;
    }
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (loginInfo.email === 'admin@admin') {
        await postAdminLogin(loginInfo).then(async () => {
          setUserInfo({
            email: 'admin',
            nickName: '',
            phoneNumber: '',
            customerId: 0,
            type: 'admin',
          });
        });
        navigate('/');
        return;
      }

      if (isSeller) {
        await postSellerLogin(loginInfo).then(async () => {
          const data = await getSellerInfo();
          setUserInfo({
            email: data.email,
            nickName: data.nickName,
            phoneNumber: data.phoneNumber,
            customerId: data.id,
            type: 'seller',
          });
        });
      } else {
        await postUserLogin(loginInfo).then(async () => {
          const data = await getUserInfo();
          setUserInfo({
            email: data.email,
            nickName: data.nickName,
            phoneNumber: data.phoneNumber,
            customerId: data.id,
            type: 'user',
          });
        });
      }
      navigate('/');
      setLoginInfo({
        email: '',
        password: '',
      });
      setIsSeller(false);
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 404) {
        return toastError('일치하는 회원이 없습니다.');
      }
      alert('로그인에 실패 했습니다. ');
    }
  };
  return (
    <>
      <form className='flex flex-col mt-10' onSubmit={(e) => onSubmit(e)}>
        <input
          className='p-2 input w-full max-w-xs bg-white focus:outline-none'
          name='email'
          type='email'
          placeholder='Email'
          required
          autoComplete='off'
          value={loginInfo.email}
          onChange={(e) => onChange(e)}
        />
        <input
          className='mt-2 p-2 input w-full max-w-xs bg-white focus:outline-none'
          name='password'
          type='password'
          placeholder='Password'
          required
          value={loginInfo.password}
          onChange={(e) => onChange(e)}
        />
        <div className='form-control'>
          <label className='label cursor-pointer justify-start'>
            <input
              type='checkbox'
              className='checkbox mr-1'
              name='seller'
              checked={isSeller}
              onChange={(e) => onChange(e)}
            />
            <span>판매자 로그인</span>
          </label>
        </div>
        <input
          className='mt-5 p-1.5 cursor-pointer btn btn-primary'
          type='submit'
          value='Login'
        />
      </form>
      <KakaoLogin />
      <ToastContainer />
    </>
  );
};

export default LoginComp;
