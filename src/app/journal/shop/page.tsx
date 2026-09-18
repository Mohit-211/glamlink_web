import JournalClient from '@/components/blogs/JournalClient'
import React, { Suspense } from 'react'

const JournalShopPage = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <JournalClient path="shop" />
      </Suspense>
    </div>
  )
}

export default JournalShopPage