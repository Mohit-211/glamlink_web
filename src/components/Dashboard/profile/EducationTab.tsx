'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import Link from 'next/link';
import { Clapperboard, ExternalLink, FileText, GraduationCap, GripVertical, Loader2, Pencil, Play, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteMyEducation, getMyEducation, getMyEducationItem, getMyProfile, reorderMyEducation } from '@/api/Api';
import ApiImage from '@/components/common/ApiImage';
import type { OwnerEducation } from '@/lib/api/profileContent';
import { formatDate, formatDuration } from '@/lib/format';
import { profileHref } from '@/lib/routes';
import EducationForm from './EducationForm';
import {
  LoadErrorPanel,
  MoveButtons,
  OrderStatusNote,
  StatePanel,
  UnavailablePanel,
  failedLoad,
  loadAll,
  moveItem,
  ownerError,
  plural,
  useOrderSaver,
  type LoadState,
} from './shared';

/*
 * Education (GET/POST /my/profile/education and friends, contract of Nov 3):
 * the owner's videos and blog posts. Published posts show in the Education
 * section of their page at once, each with its own page; drafts stay here.
 */

/** The page shows this many posts; the rest are under "View all". */
const SHOWN_ON_PAGE = 3;

interface PageLink {
  slug: string;
  visible: boolean;
}

const postHref = (page: string, item: string) => `${profileHref(page)}/education/${encodeURIComponent(item)}`;

export default function EducationTab() {
  const [items, setItems] = useState<OwnerEducation[]>([]);
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState<PageLink | null>(null);
  const [editing, setEditing] = useState<OwnerEducation | 'new' | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    // The page's slug and whether it is live, for "View on my profile". The list doesn't wait on it failing.
    Promise.all([loadAll(getMyEducation), getMyProfile().catch(() => null)])
      .then(([rows, profile]) => {
        if (!active) return;
        setItems(rows);
        const data = profile?.data;
        setPage(data?.slug ? { slug: String(data.slug), visible: Boolean(data.visible) } : null);
        setLoad({ status: 'ready' });
      })
      .catch((err) => {
        if (active) setLoad(failedLoad(err, "We couldn't load your posts."));
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const saveOrder = useCallback((ids: number[]) => reorderMyEducation(ids), []);
  const orderFailed = useCallback(
    (err: unknown) => {
      toast.error(ownerError(err, "We couldn't save the new order.").message);
      refresh();
    },
    [refresh]
  );
  const order = useOrderSaver(saveOrder, orderFailed);

  const move = (from: number, to: number) => {
    const next = moveItem(items, from, to);
    if (next === items) return;
    setItems(next);
    order.schedule(next.map((item) => item.id));
  };

  // The list has no `body`: a post opens with its own call.
  const openEditor = async (item: OwnerEducation) => {
    setOpening(item.id);
    try {
      const res = await getMyEducationItem(item.id);
      setEditing(res?.data && typeof res.data === 'object' ? { ...item, ...res.data, id: item.id } : item);
    } catch (err) {
      toast.error(ownerError(err, "We couldn't open this post.").message);
    } finally {
      setOpening(null);
    }
  };

  const remove = async (item: OwnerEducation) => {
    if (!window.confirm(`Delete “${item.title}”? It comes off your page, and this can't be undone.`)) return;
    setRemoving(item.id);
    try {
      await deleteMyEducation(item.id);
      setItems((list) => list.filter((row) => row.id !== item.id));
      if (editing !== null && editing !== 'new' && editing.id === item.id) setEditing(null);
      toast.success('Post deleted.');
    } catch (err) {
      toast.error(ownerError(err, "We couldn't delete this post.").message);
    } finally {
      setRemoving(null);
    }
  };

  const rowDrag = (index: number) => ({
    draggable: true,
    onDragStart: (event: DragEvent<HTMLLIElement>) => {
      dragFrom.current = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(items[index]?.id ?? ''));
    },
    onDragOver: (event: DragEvent<HTMLLIElement>) => {
      if (dragFrom.current === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      if (dropAt !== index) setDropAt(index);
    },
    onDrop: (event: DragEvent<HTMLLIElement>) => {
      const from = dragFrom.current;
      if (from === null) return;
      event.preventDefault();
      dragFrom.current = null;
      setDropAt(null);
      move(from, index);
    },
    onDragEnd: () => {
      dragFrom.current = null;
      setDropAt(null);
    },
  });

  const header = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold sm:text-xl">Education</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Videos and blog posts that teach what you know. They show in the Education section of your page, and each post has
          its own page.
        </p>
      </div>
      {load.status === 'ready' && editing === null && (
        <button type="button" onClick={() => setEditing('new')} className="btn-primary shrink-0 px-4 py-2 text-xs">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add a post
        </button>
      )}
    </div>
  );

  if (load.status !== 'ready') {
    return (
      <div className="space-y-6">
        {header}
        {load.status === 'loading' && (
          <div className="flex justify-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading your posts" />
          </div>
        )}
        {load.status === 'unavailable' && (
          <UnavailablePanel message={load.message}>
            <p className="max-w-sm text-sm text-muted-foreground">
              You&apos;ll be able to add videos and blog posts to your page here soon.
            </p>
          </UnavailablePanel>
        )}
        {load.status === 'error' && (
          <LoadErrorPanel
            message={load.message}
            onRetry={() => {
              setLoad({ status: 'loading' });
              refresh();
            }}
          />
        )}
      </div>
    );
  }

  const published = items.filter((item) => item.status !== 'draft');
  const onPage = new Set(published.slice(0, SHOWN_ON_PAGE).map((item) => item.id));
  const drafts = items.length - published.length;

  return (
    <div className="space-y-6">
      {header}

      {editing !== null && (
        <EducationForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

      {items.length === 0 ? (
        editing === null && (
          <StatePanel icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />} title="No posts yet">
            <p className="max-w-md text-sm text-muted-foreground">
              Teach what you know: a how-to video, a technique, a blog post with pictures. Posts show in the Education section
              of your page, and each one gets its own page.
            </p>
            <button type="button" onClick={() => setEditing('new')} className="btn-outline mt-1 px-4 py-2 text-xs">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add your first post
            </button>
          </StatePanel>
        )
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {plural(items.length, 'post')}
              {drafts > 0 && ` · ${plural(drafts, 'draft')}`}. The first {SHOWN_ON_PAGE} published posts show on your page,
              and every published post under View all. Drag to reorder, or use the arrows.
              {page && !page.visible && " Your page isn't live yet, so posts can't be viewed there."}
            </p>
            <OrderStatusNote status={order.status} />
          </div>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item, index) => {
              const isDraft = item.status === 'draft';
              const isVideo = item.kind === 'video';
              const cover = item.cover_image || item.video?.thumbnail || null;
              const KindIcon = isVideo ? Clapperboard : FileText;
              const when = isDraft ? '' : formatDate(item.published_at);
              const duration = isVideo ? formatDuration(item.video?.duration_seconds) : '';
              return (
                <li
                  key={item.id}
                  {...rowDrag(index)}
                  className={`flex flex-wrap items-center gap-3 p-3 transition-colors sm:flex-nowrap sm:gap-4 sm:p-4 ${
                    dropAt === index ? 'bg-accent' : ''
                  }`}
                >
                  <span className="hidden cursor-grab text-muted-foreground/70 active:cursor-grabbing sm:block" title="Drag to reorder">
                    <GripVertical className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
                    {cover ? (
                      <ApiImage src={cover} alt="" fill sizes="96px" draggable={false} className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground/60">
                        <KindIcon className="h-6 w-6" aria-hidden="true" />
                      </span>
                    )}
                    {isVideo && cover && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-overlay/55 text-overlay-foreground">
                          <Play className="h-3.5 w-3.5 translate-x-px" aria-hidden="true" />
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <KindIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {[isVideo ? 'Video' : 'Blog post', duration, when].filter(Boolean).join(' · ')}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          isDraft ? 'bg-muted text-muted-foreground' : 'bg-success/10 text-success'
                        }`}
                      >
                        {isDraft ? 'Draft' : 'Live'}
                      </span>
                      {onPage.has(item.id) && <span className="text-xs font-medium text-secondary">On your page</span>}
                      {!isDraft && page?.visible && item.slug && (
                        <Link
                          href={postHref(page.slug, item.slug)}
                          target="_blank"
                          className="link-glamlink inline-flex items-center gap-1 text-xs"
                        >
                          View on my profile
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center">
                    <MoveButtons index={index} count={items.length} name={`“${item.title}”`} onMove={(to) => move(index, to)} />
                    <button
                      type="button"
                      onClick={() => openEditor(item)}
                      disabled={opening !== null}
                      aria-label={`Edit “${item.title}”`}
                      title="Edit"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-secondary disabled:opacity-40"
                    >
                      {opening === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      disabled={removing === item.id}
                      aria-label={`Delete “${item.title}”`}
                      title="Delete"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    >
                      {removing === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
