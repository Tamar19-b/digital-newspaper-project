// src/components/GlobalToast.tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '.';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useEffect } from 'react';
import { clearMessage } from './slices/messageSlice';

const GlobalToast = () => {
  const dispatch = useDispatch();
  const message = useSelector((state: RootState) => state.message);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message.text) return null;

  return (
    <ToastContainer position="top-center" className="p-3">
      <Toast bg={message.type === 'error' ? 'danger' : 'success'}>
        <Toast.Body>{message.text}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalToast;
