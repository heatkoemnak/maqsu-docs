import React from 'react'
import PageContent from './PageContent'
import { BookProvider } from '../context/BookProvider'

function Page() {
  return (
    <BookProvider>
      <PageContent />
    </BookProvider>
  )
}

export default Page