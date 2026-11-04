import * as React from "react"
import { ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A native select with the site's own arrow: a thin muted chevron set in from the edge, as on the custom dropdowns.
 * The browser's arrow sat against the border and drew heavy and black, most of all on the rounded filters (Nov 4).
 * `className` styles the select (usually input-glamlink); `wrapperClassName` takes its layout in a row (width, flex,
 * margins). `loading` turns the arrow into a spinner.
 */
function NativeSelect({
  className,
  wrapperClassName,
  loading = false,
  ...props
}: React.ComponentProps<"select"> & { wrapperClassName?: string; loading?: boolean }) {
  const Icon = loading ? Loader2 : ChevronDown
  return (
    <div data-slot="native-select-wrapper" className={cn("relative", wrapperClassName)}>
      <select data-slot="native-select" className={cn(className, "peer appearance-none pr-10")} {...props} />
      <Icon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-60",
          loading && "animate-spin"
        )}
      />
    </div>
  )
}

export { NativeSelect }
