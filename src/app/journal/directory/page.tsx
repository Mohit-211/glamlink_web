import JournalClient from '@/components/blogs/JournalClient'
import DirectoryPageClient from '@/components/directory/DirectoryPageClient'
import React, { Suspense } from 'react'

const JournalDirectoryPage = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <JournalClient path="directory" />
        
      </Suspense>
    </div>
  )
}

export default JournalDirectoryPage
