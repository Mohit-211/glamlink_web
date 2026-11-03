"use client";

import { createContext, useCallback, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/*
 * One list's navigation (the Shop's search, filters and sort, Nov 4): a change loads the list where it stands, with no
 * scroll, and the results already shown stay, dimmed, until the new ones arrive. Without it the page seemed to blink
 * and jump back to the hero on every choice.
 */

interface ListNavigationValue {
  pending: boolean;
  navigate: (href: string) => void;
}

const ListNavigationContext = createContext<ListNavigationValue | null>(null);

export function ListNavigation({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = useCallback(
    (href: string) => startTransition(() => router.push(href, { scroll: false })),
    [router]
  );
  return <ListNavigationContext.Provider value={{ pending, navigate }}>{children}</ListNavigationContext.Provider>;
}

/** The list's navigation; outside a ListNavigation (the Professionals and Brands pages), a transition of its own. */
export function useListNavigation(): ListNavigationValue {
  const shared = useContext(ListNavigationContext);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = useCallback(
    (href: string) => startTransition(() => router.push(href, { scroll: false })),
    [router]
  );
  return shared ?? { pending, navigate };
}

/** The results: dimmed while a change loads. */
export function ListResults({ children, className }: { children: ReactNode; className?: string }) {
  const pending = useContext(ListNavigationContext)?.pending ?? false;
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "opacity-60", className)}>
      {children}
    </div>
  );
}
