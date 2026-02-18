# Lock Management Package - Usage Guide

## Overview

The Lock Management Package provides a complete, reusable solution for managing collaborative editing locks. It eliminates the need for manual timer management, countdown logic, and scattered lock state handling.

## Key Benefits

✅ **One-line setup**: Just wrap your component with `<LockManager>`  
✅ **No manual timers**: All countdown/refresh logic handled internally  
✅ **Clean data**: Business data not polluted with lock fields  
✅ **Reusable everywhere**: Same pattern for any editable resource  
✅ **Type safe**: Full TypeScript support with standardized interfaces  

## Quick Start

### 1. Basic Lock Management

```tsx
import { LockManager } from '@/lib/packages/lock-management';

function MyEditForm({ resourceId }: { resourceId: string }) {
  return (
    <LockManager
      resourceId={resourceId}
      collection="magazine_issues"
      lockGroup="metadata"
    >
      {({ lock, actions, isLoading }) => (
        <div>
          {/* Lock indicator appears automatically when needed */}
          {!lock.canEdit && (
            <div className="lock-warning">
              Locked by {lock.holder?.userName}
              Expires in {lock.formattedTime}
              {lock.canTransfer && (
                <button onClick={() => actions.transfer()}>
                  Take Control
                </button>
              )}
            </div>
          )}
          
          {/* Your form fields */}
          <input 
            disabled={!lock.canEdit}
            // ... rest of props
          />
          
          {isLoading && <div>Updating lock...</div>}
        </div>
      )}
    </LockManager>
  );
}
```

### 2. Even Simpler with EditableContent

```tsx
import { EditableContent } from '@/lib/packages/lock-management';

function MyEditForm({ resourceId }: { resourceId: string }) {
  return (
    <EditableContent
      resourceId={resourceId}
      collection="magazine_issues"
      autoAcquire={true}
    >
      <div>
        <input type="text" placeholder="Title" />
        <textarea placeholder="Content" />
        <button>Save</button>
      </div>
    </EditableContent>
  );
}

// That's it! Lock indicators, timers, multi-tab detection all handled automatically
```

## Advanced Usage

### Lock Groups (Shared Locks)

Multiple form sections can share the same lock:

```tsx
// Basic Info and Cover Config share "metadata" lock
<LockManager resourceId={issueId} collection="issues" lockGroup="metadata">
  {/* Basic info form */}
</LockManager>

<LockManager resourceId={issueId} collection="issues" lockGroup="metadata">
  {/* Cover config form - same lock! */}
</LockManager>

// Individual sections get their own locks
<LockManager resourceId={`${issueId}-section-1`} collection="sections">
  {/* Section 1 - independent lock */}
</LockManager>
```

### Custom Lock Configuration

```tsx
<LockManager
  resourceId={resourceId}
  collection="magazine_issues"
  lockGroup="metadata"
  autoAcquire={false}        // Don't auto-acquire on mount
  autoRefresh={true}         // Auto-extend locks (default)
  refreshInterval={45000}    // Custom refresh interval
  onLockAcquired={(status) => console.log('Lock acquired!', status)}
  onLockLost={(reason) => alert(`Lock lost: ${reason}`)}
>
  {/* Your content */}
</LockManager>
```

### Direct Hook Usage

For custom implementations:

```tsx
import { useLockManagement } from '@/lib/packages/lock-management';

function CustomComponent() {
  const { lock, actions, isLoading, error } = useLockManagement({
    resourceId: 'my-resource',
    collection: 'my_collection',
    autoAcquire: true,
    onLockLost: (reason) => {
      // Handle lock loss
      navigate('/readonly-view');
    }
  });

  // All timer logic, countdown, refresh handled automatically!
  
  return (
    <div>
      <div>Status: {lock.status}</div>
      <div>Can Edit: {lock.canEdit}</div>
      <div>Time Remaining: {lock.formattedTime}</div>
      
      <button onClick={actions.acquire}>Get Lock</button>
      <button onClick={actions.release}>Release</button>
    </div>
  );
}
```

## Migration Guide

### Before (Old Way - 100+ lines of boilerplate)

```tsx
// ❌ OLD: Lots of manual lock management
function OldIssueEditForm() {
  const [lockStatus, setLockStatus] = useState(null);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);
  const [isAcquiringLock, setIsAcquiringLock] = useState(false);
  
  // Timer for countdown
  useEffect(() => {
    if (!lockStatus?.lockExpiresAt) {
      setLockRemainingSeconds(0);
      return;
    }
    
    const updateCountdown = () => {
      const now = new Date();
      const expires = new Date(lockStatus.lockExpiresAt);
      const remaining = Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / 1000));
      setLockRemainingSeconds(remaining);
      
      if (remaining === 0) {
        onRefreshIssue?.();
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockStatus?.lockExpiresAt]);

  // Timer for auto-refresh
  useEffect(() => {
    if (!useCollaboration || !issue?.id) return;
    
    const refreshInterval = setInterval(() => {
      refreshLockStatus();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [issue?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      releaseLock();
    };
  }, []);

  const acquireLock = async () => {
    setIsAcquiringLock(true);
    try {
      const response = await fetch(`/api/issues/${issueId}/lock`, {
        method: 'POST',
        // ... complex logic
      });
      // ... handle responses, conflicts, etc.
    } finally {
      setIsAcquiringLock(false);
    }
  };

  const formatTime = (seconds) => {
    // Manual time formatting logic
  };

  // ... 100+ more lines of lock logic
}
```

### After (New Way - 3 lines!)

```tsx
// ✅ NEW: Clean and simple
function NewIssueEditForm() {
  return (
    <LockManager resourceId={issueId} collection="magazine_issues" lockGroup="metadata">
      {({ lock, actions }) => (
        <div>
          {/* All lock logic handled automatically! */}
          <MyFormFields disabled={!lock.canEdit} />
        </div>
      )}
    </LockManager>
  );
}
```

## Data Structure Changes

### Old Structure (Mixed Business + Lock Data)

```javascript
// ❌ OLD: Lock fields pollute business data
magazine_issues: {
  title: "Summer Edition",
  subtitle: "Beach Beauty Tips",
  
  // Lock fields mixed in - messy!
  lockExpiresAt: "2025-08-31T04:11:17.353Z",
  lockGroup: "issue-metadata",
  lockedAt: "2025-08-31T04:01:17.353Z",
  lockedBy: "user123",
  lockedByEmail: "user@example.com",
  lockedByName: "John Doe",
  lockedTabId: "tab-abc123"
}
```

### New Structure (Clean Separation)

```javascript
// ✅ NEW: Clean business data
magazine_issues: {
  title: "Summer Edition",
  subtitle: "Beach Beauty Tips"
  // No lock fields!
}

// ✅ NEW: Locks stored separately
resource_locks: {
  id: "magazine_issues:issue-123:metadata",
  resourceType: "magazine_issues",
  resourceId: "issue-123",
  lock: {
    userId: "user123",
    info: {
      lockedAt: "2025-08-31T04:01:17.353Z",
      lockExpiresAt: "2025-08-31T04:11:17.353Z",
      lockPath: ["magazine_issues", "issue-123"],
      lockedTabId: "tab-abc123",
      userName: "John Doe",
      userEmail: "user@example.com",
      lockGroup: "metadata"
    }
  }
}
```

## Real-World Examples

### Magazine Issue Editor

```tsx
function IssueEditor({ issue }) {
  return (
    <div className="issue-editor">
      {/* Shared lock for basic info and cover */}
      <LockManager resourceId={issue.id} collection="issues" lockGroup="metadata">
        {({ lock }) => (
          <div className="metadata-section">
            <BasicInfoForm disabled={!lock.canEdit} />
            <CoverConfigForm disabled={!lock.canEdit} />
          </div>
        )}
      </LockManager>

      {/* Individual locks for each section */}
      {issue.sections?.map((section, index) => (
        <EditableContent
          key={section.id}
          resourceId={section.id}
          collection="magazine_sections"
          autoAcquire={false}
        >
          <SectionEditor section={section} />
        </EditableContent>
      ))}
    </div>
  );
}
```

### Download Generator (Future Use Case)

```tsx
function DownloadGenerator({ resourceId }) {
  return (
    <LockManager 
      resourceId={resourceId} 
      collection="download_jobs"
      autoAcquire={true}
    >
      {({ lock, actions }) => (
        <div>
          {lock.canEdit ? (
            <div>
              <button onClick={() => startDownload()}>
                Generate PDF
              </button>
              <ProgressBar />
            </div>
          ) : (
            <div>
              PDF generation in progress by {lock.holder?.userName}
              <div>Time remaining: {lock.formattedTime}</div>
            </div>
          )}
        </div>
      )}
    </LockManager>
  );
}
```

## API Reference

### Components

- **`<LockManager>`** - Main wrapper component with render props
- **`<EditableContent>`** - Simple wrapper that auto-handles locks
- **`<LockIndicator>`** - Standalone lock status display
- **`<LockStatusDisplay>`** - Debug component showing all lock info

### Hooks

- **`useLockManagement(options)`** - Comprehensive lock management
- **`useLockContext()`** - Access lock state from within LockManager

### Services

- **`LockStorageService`** - Handles separated lock storage

### Types

- **`LockStatus`** - Current lock state info
- **`LockActions`** - Available lock actions
- **`ResourceWithLock<T>`** - Clean data + lock structure

## Migration Checklist

1. **Install Dependencies**: Ensure lock-management package is available
2. **Update API Routes**: Add GET endpoint for lock status checking
3. **Wrap Components**: Replace manual lock logic with LockManager
4. **Clean Data**: Remove lock fields from business documents
5. **Test Multi-tab**: Verify lock indicators work across tabs
6. **Update Types**: Use new standardized lock types

## Benefits Summary

| Aspect | Before | After |
|--------|--------|--------|
| Setup Lines | 100+ lines | 3 lines |
| Timer Management | Manual useEffects | Automatic |
| Data Structure | Mixed lock fields | Clean separation |
| Reusability | Copy-paste logic | Import component |
| Multi-tab Detection | Custom implementation | Built-in |
| Type Safety | Custom types | Standardized types |
| Error Handling | Manual try-catch | Built-in handling |
| Testing | Complex mocking | Simple prop testing |

The lock-management package transforms collaborative editing from a complex, error-prone setup into a simple, reusable solution that works consistently across your entire application! 🚀