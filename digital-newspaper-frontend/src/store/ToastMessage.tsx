// components/ToastMessage.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '../store/slices/messageSlice';
import { Toast } from 'react-bootstrap';
import type { RootState } from '../store';

export default function ToastMessage() {
  /*const dispatch = useDispatch();
  const message = useSelector((state: RootState) => state.message.value);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;*/

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
      
    </div>
  );
}
