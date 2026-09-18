import JournalClient from '@/components/blogs/JournalClient'
<<<<<<< HEAD
import DirectoryPageClient from '@/components/directory/DirectoryPageClient'
=======
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
import React, { Suspense } from 'react'

const JournalDirectoryPage = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <JournalClient path="directory" />
<<<<<<< HEAD
        
=======
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
      </Suspense>
    </div>
  )
}

export default JournalDirectoryPage
