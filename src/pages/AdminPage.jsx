import React, { useEffect } from 'react';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage({ onShowToast }) {
  useEffect(() => {
    document.title = 'Панель управления — Капибаропедия';
  }, []);

  return (
    <AdminPanel onShowToast={onShowToast} />
  );
}
