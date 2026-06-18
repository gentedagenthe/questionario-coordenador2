import React from 'react';
import QuestionarioDEI from './QuestionarioDEI';
import AdminPanel from './AdminPanel';

export default function App() {
  const isAdmin = window.location.pathname === '/admin';
  return isAdmin ? <AdminPanel /> : <QuestionarioDEI />;
}
