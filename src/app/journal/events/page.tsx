import JournalClient from '@/components/blogs/JournalClient'
import React, { Suspense } from 'react'

const JournalEventPage = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <JournalClient path="event" />
      </Suspense>
    </div>
  )
}

export default JournalEventPage