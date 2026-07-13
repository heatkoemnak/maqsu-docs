import React from 'react';
import Layout from '@theme/Layout';
import Navbar from '../components/Navbar/Navbar';
import { BookProvider } from '../context/BookProvider';

export default function DefaultLayout({children}) {
  return (
    <BookProvider>

    <Layout noFooter>
        <div style={{background: 'var(--site-bg)'}}>
            <Navbar/>
            {children}
        </div>
    </Layout>
    </BookProvider>
  );
}
