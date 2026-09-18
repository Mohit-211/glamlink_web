import JournalClient from '@/components/blogs/JournalClient'
import React, { Suspense } from 'react'

const JournalEducationPage = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <JournalClient path="education" />
      </Suspense>
    </div>
  )
}

export default JournalEducationPage