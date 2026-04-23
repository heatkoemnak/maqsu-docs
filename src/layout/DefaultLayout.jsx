import React from 'react';
import Layout from '@theme/Layout';
import Navbar from '../components/Navbar/Navbar';

export default function DefaultLayout({children}) {
  return (
    <Layout noFooter>
      <div style={{backgroundColor: 'transparent'}}>
          <Navbar/>
          {children}
      </div>
    </Layout>
  );
}
