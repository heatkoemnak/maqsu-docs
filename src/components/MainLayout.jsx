import React from 'react';
import Footer from './Footer';
import { BookProvider } from '../context/BookProvider';

export default function MainLayout({ children }) {
  return (
    <BookProvider>
      <main>{children}</main>
      <Footer/>
    </BookProvider>

  );
}
