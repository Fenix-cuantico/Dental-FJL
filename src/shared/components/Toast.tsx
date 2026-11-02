import React from 'react';
import { Icon } from './Icon';
import './Toast.css';

interface ToastProps {
  message: string | null;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <div className={`toast ${visible ? 'show' : ''}`} role="status" aria-live="polite">
      <Icon name="check" style={{ color: 'var(--ok)' }} />
      <span>{message}</span>
    </div>
  );
};
