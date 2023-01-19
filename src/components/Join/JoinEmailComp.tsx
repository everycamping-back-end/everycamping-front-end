import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  postEmailCheck,
  postEmailCheckReturn,
  postSellerJoin,
  postUserJoin,
} from '../../api/userService';
import { EMAIL_STYLE } from '../../constant/emailStyle';

import Modal from '../Modal/Modal';

export type JoinEmailCompType = {
  email: string;
  nickName: string;
  password: string;
  phoneNumber: string;
};

const JoinEmailComp = () => {
  const [joinInfo, setJoinInfo] = useState<JoinEmailCompType>({
    email: '',
    nickName: '',
    password: '',
    phoneNumber: '',
  });
  const [isSeller, setIsSeller] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [code, setCode] = useState('');
  const [toggleEmailModal, setToggleEmailModal] = useState(false);
  const [toggleCodeModal, setToggleCodeModal] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailButtonRef = useRef<HTMLButtonElement>(null);
  const codeDivRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
    } else if (name === 'code') {
      setCode(value);
    } else if (name === 'seller') {
      setIsSeller((prev) => !prev);
    } else {
      setJoinInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (joinInfo.password.length < 6 || joinInfo.password !== passwordConfirm)
      return;

    if (code === '') {
      return alert('이메일 인증이 완료되지 않았습니다.');
    }
    try {
      if (isSeller) {
        await postSellerJoin(joinInfo).then(() => navigate('/login'));
      } else {
        await postUserJoin(joinInfo).then(() => navigate('/login'));
      }
    } catch (error) {
      console.error(error);
      alert('회원 가입에 실패 했습니다.');
    }
  };

  const checked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;

    if (name === 'email') {
      if (!joinInfo.email.match(EMAIL_STYLE)) {
        return alert('이메일 형식에 맞지 않습니다.');
      }

      try {
        await postEmailCheck(joinInfo.email);
      } catch (err) {
        console.log(err);
        // if (err) return alert('이미 사용중인 이메일 입니다.');
        return;
      }

      //result에 맞게 조건 수정

      setToggleEmailModal(true);
      (codeDivRef.current as HTMLDivElement).style.display = 'flex';
    }
    if (name === 'code') {
      try {
        await postEmailCheckReturn(joinInfo.email, code);
      } catch (err) {
        console.error(err);
        alert('잘못된 코드 입니다.');
        return;
      }

      setToggleCodeModal(true);
      (codeDivRef.current as HTMLDivElement).style.display = 'none';
      (emailInputRef.current as HTMLInputElement).disabled = true;
      (emailButtonRef.current as HTMLInputElement).disabled = true;
    }
  };

  return (
    <div>
      <form className='flex flex-col mt-10' onSubmit={(e) => onSubmit(e)}>
        <div className='flex relative w-full'>
          <input
            className='p-2 input w-full max-w-xs bg-white focus:outline-none'
            name='email'
            type='email'
            placeholder='Email'
            required
            autoComplete='off'
            value={joinInfo.email}
            onChange={(e) => onChange(e)}
            ref={emailInputRef}
          />
          <button
            className='absolute left-full w-24 ml-2 p-2 btn btn-primary'
            name='email'
            type='button'
            onClick={(e) => checked(e)}
            ref={emailButtonRef}
          >
            인증하기
          </button>
        </div>
        <div className='flex relative mt-2 w-full hidden' ref={codeDivRef}>
          <input
            className='p-2 input w-full max-w-xs bg-white focus:outline-none'
            name='code'
            type='text'
            placeholder='인증코드'
            autoComplete='off'
            value={code}
            onChange={(e) => onChange(e)}
          />
          <button
            className='absolute left-full w-24 ml-2 p-2 btn btn-primary'
            name='code'
            type='button'
            onClick={(e) => checked(e)}
          >
            인증완료
          </button>
        </div>
        <div className='flex relative mt-2 w-full'>
          <input
            className='p-2 input w-full max-w-xs bg-white focus:outline-none'
            name='nickName'
            type='text'
            placeholder='Nick Name'
            required
            autoComplete='off'
            value={joinInfo.nickName}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='flex relative w-full'>
          <input
            className='mt-2 p-2 input w-full max-w-xs bg-white focus:outline-none'
            name='password'
            type='password'
            placeholder='Password'
            required
            value={joinInfo.password}
            onChange={(e) => onChange(e)}
          />
          {joinInfo.password && joinInfo.password.length < 6 ? (
            <span className='absolute left-full bottom-2 ml-2 whitespace-nowrap text-sm text-red-500'>
              비밀번호는 최소 6글자 이상 이어야 합니다.
            </span>
          ) : (
            ''
          )}
        </div>
        <div className='flex relative w-full'>
          <input
            className='mt-2 p-2 input w-full max-w-xs bg-white focus:outline-none'
            name='passwordConfirm'
            type='password'
            placeholder='Password Confirm'
            required
            value={passwordConfirm}
            onChange={(e) => onChange(e)}
          />
          {passwordConfirm && passwordConfirm !== joinInfo.password ? (
            <span className='absolute left-full bottom-2 ml-2 whitespace-nowrap text-sm text-red-500'>
              비밀번호가 일치하지 않습니다.
            </span>
          ) : (
            ''
          )}
        </div>
        <input
          className='mt-2 p-2 input w-full max-w-xs bg-white focus:outline-none'
          name='phoneNumber'
          type='tel'
          placeholder='010-0000-0000'
          required
          autoComplete='off'
          value={joinInfo.phoneNumber}
          onChange={(e) => onChange(e)}
          pattern='[0,1]{3}-[0-9]{4}-[0-9]{4}'
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
            <span>판매자로 가입</span>
          </label>
          <div>
            <p className='absolute mt-0.5 text-sm text-red-500'>
              * 판매자 가입은 승인까지 2~3일 정도 소요 됩니다.
            </p>
          </div>
        </div>
        <input
          className='mt-10 p-1.5 cursor-pointer btn btn-primary'
          type='submit'
          value='Join'
        />
      </form>
      <Modal
        toggleModal={toggleEmailModal}
        setToggleModal={setToggleEmailModal}
      >
        이메일로 코드가 전송 되었습니다.
      </Modal>
      <Modal toggleModal={toggleCodeModal} setToggleModal={setToggleCodeModal}>
        이메일 인증이 완료 되었습니다.
      </Modal>
      {/* <div className='alert alert-error shadow-lg whitespace-nowrap'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current flex-shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>이메일 형식에 맞지 않습니다.</span>
        </div>
      </div> */}
    </div>
  );
};

export default JoinEmailComp;
