'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent, type HTMLAttributes } from 'react';
import { EyeOff, Film, ImagePlus, Images, Import, Link2, Loader2, Pencil, Play, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  addMyMedia,
  addMyMediaLink,
  deleteMyMedia,
  getMyMedia,
  importMyCardMedia,
  reorderMyMedia,
  updateMyMedia,
} from '@/api/Api';
import ApiImage from '@/components/common/ApiImage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { OwnerMedia } from '@/lib/api/profileContent';
import {
  FieldError,
  LoadErrorPanel,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  MoveButtons,
  OrderStatusNote,
  StatePanel,
  UnavailablePanel,
  UploadProgressBar,
  chunk,
  failedLoad,
  isMp4,
  loadAll,
  makePoster,
  moveItem,
  ownerError,
  plural,
  useOrderSaver,
  videoLink,
  type LoadState,
} from './shared';

/*
 * Media & Images (GET/POST /my/profile/media and friends, contract of Nov 3):
 * the photos and videos on the owner's page, with no limit on any plan. Until
 * the owner adds their own, the page shows their Access card's photos.
 */

/** POST /my/profile/media takes at most 20 images a request. */
const IMAGE_BATCH = 20;
const CAPTION_MAX = 255;
const ALT_MAX = 255;
/** The page shows this many items; the rest are under "View all". */
const SHOWN_ON_PAGE = 5;

const SOURCE_LABEL: Record<string, string> = { youtube: 'YouTube', vimeo: 'Vimeo', card: 'Access card' };

const nameOf = (item: OwnerMedia) => (item.kind === 'video' ? 'video' : 'photo');
const pictureOf = (item: OwnerMedia) => (item.kind === 'video' ? item.thumbnail : item.url || item.thumbnail);

interface Busy {
  label: string;
  fraction: number | null;
}

function LinkForm({ onAdded, onCancel }: { onAdded: () => void; onCancel: () => void }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const link = videoLink(url);
    if (!link) {
      setError({ field: 'url', message: 'Paste a link to a video on YouTube or Vimeo.' });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addMyMediaLink({ url: link.url, ...(caption.trim() ? { caption: caption.trim() } : {}) });
      toast.success('Video added to your page.');
      onAdded();
    } catch (err) {
      const { message, field } = ownerError(err, "We couldn't add this video.");
      setError({ field: field === 'caption' ? 'caption' : 'url', message });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Add a YouTube or Vimeo link</h3>
        <button type="button" onClick={onCancel} aria-label="Close" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div>
        <label htmlFor="media-link-url" className="label-glamlink">
          Video link *
        </label>
        <input
          id="media-link-url"
          type="text"
          inputMode="url"
          autoComplete="off"
          required
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          aria-invalid={error?.field === 'url' || undefined}
          className="input-glamlink"
        />
        <FieldError message={error?.field === 'url' ? error.message : null} />
      </div>
      <div>
        <label htmlFor="media-link-caption" className="label-glamlink">
          Caption
        </label>
        <input
          id="media-link-caption"
          value={caption}
          maxLength={CAPTION_MAX}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What it shows (optional)"
          aria-invalid={error?.field === 'caption' || undefined}
          className="input-glamlink"
        />
        <FieldError message={error?.field === 'caption' ? error.message : null} />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary px-5 py-2.5 text-xs" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Add video
        </button>
        <button type="button" onClick={onCancel} className="link-glamlink text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function DetailsForm({
  item,
  onSaved,
  onCancel,
}: {
  item: OwnerMedia;
  onSaved: (item: OwnerMedia) => void;
  onCancel: () => void;
}) {
  const [caption, setCaption] = useState(item.caption ?? '');
  const [alt, setAlt] = useState(item.alt ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const changes = { caption: caption.trim(), alt: alt.trim() };
    try {
      const res = await updateMyMedia(item.id, changes);
      const saved = res?.data && typeof res.data === 'object' ? res.data : null;
      onSaved(
        saved
          ? { ...item, ...saved, id: item.id }
          : { ...item, caption: changes.caption || null, alt: changes.alt || null }
      );
      toast.success('Saved.');
    } catch (err) {
      const { message, field } = ownerError(err, "We couldn't save these details.");
      setError({ field: field === 'alt' ? 'alt' : 'caption', message });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const picture = pictureOf(item);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {picture && (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
          <ApiImage src={picture} alt="" fill sizes="480px" className="object-contain" />
        </div>
      )}
      <div>
        <label htmlFor="media-caption" className="label-glamlink">
          Caption
        </label>
        <input
          id="media-caption"
          value={caption}
          maxLength={CAPTION_MAX}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Shown with the picture on your page"
          aria-invalid={error?.field === 'caption' || undefined}
          className="input-glamlink"
        />
        <FieldError message={error?.field === 'caption' ? error.message : null} />
      </div>
      <div>
        <label htmlFor="media-alt" className="label-glamlink">
          Alt text
        </label>
        <input
          id="media-alt"
          value={alt}
          maxLength={ALT_MAX}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="What the picture shows, for people who can't see it"
          aria-invalid={error?.field === 'alt' || undefined}
          className="input-glamlink"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">Read aloud by screen readers, and used by search engines.</p>
        <FieldError message={error?.field === 'alt' ? error.message : null} />
      </div>
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <button type="submit" className="btn-primary px-5 py-2.5 text-xs" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save
        </button>
        <button type="button" onClick={onCancel} className="link-glamlink text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function MediaTile({
  item,
  index,
  count,
  onPage,
  locked,
  removing,
  dropTarget,
  onMove,
  onEdit,
  onRemove,
  dragProps,
}: {
  item: OwnerMedia;
  index: number;
  count: number;
  onPage: boolean;
  locked: boolean;
  removing: boolean;
  dropTarget: boolean;
  onMove: (to: number) => void;
  onEdit: () => void;
  onRemove: () => void;
  dragProps: HTMLAttributes<HTMLLIElement>;
}) {
  const picture = pictureOf(item);
  const name = nameOf(item);
  const source = SOURCE_LABEL[item.source];
  return (
    <li
      {...dragProps}
      className={`flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow ${
        dropTarget ? 'border-secondary ring-2 ring-secondary/30' : 'border-border'
      } ${locked ? '' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <div className="relative aspect-square bg-muted">
        {picture ? (
          <ApiImage
            src={picture}
            alt={item.alt || item.caption || ''}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
            draggable={false}
            className={`object-cover ${item.is_hidden ? 'opacity-40' : ''}`}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-muted-foreground/60">
            {item.kind === 'video' ? <Film className="h-8 w-8" aria-hidden="true" /> : <ImagePlus className="h-8 w-8" aria-hidden="true" />}
          </span>
        )}
        {item.kind === 'video' && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-overlay/55 text-overlay-foreground">
              <Play className="h-5 w-5 translate-x-px" aria-hidden="true" />
              <span className="sr-only">Video</span>
            </span>
          </span>
        )}
        <span className="absolute left-2 top-2 flex flex-wrap gap-1">
          {onPage && (
            <span className="rounded-full bg-card/90 px-2 py-0.5 text-xs font-semibold text-secondary shadow-soft">
              On page
            </span>
          )}
          {source && (
            <span className="rounded-full bg-card/90 px-2 py-0.5 text-xs font-medium text-foreground shadow-soft">{source}</span>
          )}
        </span>
        {item.is_hidden && (
          <span
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2 py-0.5 text-xs font-semibold text-background"
            title="Glamlink has hidden this. It doesn't show on your page."
          >
            <EyeOff className="h-3 w-3" aria-hidden="true" />
            Hidden
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className={`truncate text-xs ${item.caption ? 'text-foreground' : 'text-muted-foreground'}`} title={item.caption ?? undefined}>
          {item.caption || 'No caption'}
        </p>
        {item.is_hidden && <p className="text-xs leading-snug text-muted-foreground">Hidden by Glamlink: not on your page.</p>}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center">
            <MoveButtons index={index} count={count} name={`${name} ${index + 1}`} across disabled={locked} onMove={onMove} />
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit the caption and alt text of ${name} ${index + 1}`}
              title="Caption and alt text"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-secondary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={removing || locked}
              aria-label={`Delete ${name} ${index + 1}`}
              title="Delete"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
            >
              {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function MediaTab() {
  const [items, setItems] = useState<OwnerMedia[]>([]);
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState<Busy | null>(null);
  const [addingLink, setAddingLink] = useState(false);
  const [editing, setEditing] = useState<OwnerMedia | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const [filesOver, setFilesOver] = useState(false);
  const dragFrom = useRef<number | null>(null);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    loadAll(getMyMedia)
      .then((rows) => {
        if (!active) return;
        setItems(rows);
        setLoad({ status: 'ready' });
      })
      .catch((err) => {
        if (active) setLoad(failedLoad(err, "We couldn't load your media."));
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const saveOrder = useCallback((ids: number[]) => reorderMyMedia(ids), []);
  const orderFailed = useCallback(
    (err: unknown) => {
      toast.error(ownerError(err, "We couldn't save the new order.").message);
      refresh();
    },
    [refresh]
  );
  const order = useOrderSaver(saveOrder, orderFailed);

  const locked = busy !== null;

  const move = (from: number, to: number) => {
    const next = moveItem(items, from, to);
    if (next === items) return;
    setItems(next);
    order.schedule(next.map((item) => item.id));
  };

  const uploadPhotos = async (picked: File[]) => {
    const pictures = picked.filter((file) => file.type.startsWith('image/'));
    const files = pictures.filter((file) => file.size <= MAX_UPLOAD_BYTES);
    const tooBig = pictures.length - files.length;
    if (tooBig) toast.error(`${plural(tooBig, 'photo')} over ${MAX_UPLOAD_MB} MB left out.`);
    if (!files.length) return;
    const label = `Uploading ${plural(files.length, 'photo')}`;
    let done = 0;
    try {
      for (const batch of chunk(files, IMAGE_BATCH)) {
        const form = new FormData();
        batch.forEach((file) => form.append('images', file));
        setBusy({ label, fraction: done / files.length });
        await addMyMedia(form, (fraction) => setBusy({ label, fraction: (done + fraction * batch.length) / files.length }));
        done += batch.length;
      }
      toast.success(`${plural(done, 'photo')} added to your page.`);
    } catch (err) {
      const { message } = ownerError(err, "We couldn't upload your photos.");
      toast.error(done ? `${plural(done, 'photo')} added. The rest didn't upload: ${message}` : message);
    } finally {
      setBusy(null);
      refresh();
    }
  };

  const uploadVideos = async (picked: File[]) => {
    const mp4s = picked.filter(isMp4);
    if (mp4s.length < picked.length) toast.error('Videos need to be MP4 files.');
    const files = mp4s.filter((file) => file.size <= MAX_UPLOAD_BYTES);
    const tooBig = mp4s.length - files.length;
    if (tooBig) toast.error(`${plural(tooBig, 'video')} over ${MAX_UPLOAD_MB} MB left out.`);
    if (!files.length) return;
    let added = 0;
    for (const [i, file] of files.entries()) {
      const label = files.length > 1 ? `Video ${i + 1} of ${files.length}` : 'Your video';
      setBusy({ label: `${label}: making its poster`, fraction: null });
      let poster: File;
      try {
        poster = await makePoster(file);
      } catch {
        toast.error(`We couldn't read “${file.name}”. Try exporting it again as an MP4.`);
        continue;
      }
      const form = new FormData();
      form.append('videos', file);
      form.append('video_thumbnails', poster);
      try {
        setBusy({ label: `${label}: uploading`, fraction: 0 });
        await addMyMedia(form, (fraction) => setBusy({ label: `${label}: uploading`, fraction }));
        added++;
      } catch (err) {
        toast.error(ownerError(err, "We couldn't upload your video.").message);
        break;
      }
    }
    setBusy(null);
    if (added) toast.success(`${plural(added, 'video')} added to your page.`);
    refresh();
  };

  // Files dropped anywhere on the tab: pictures and MP4s go to their own uploads.
  const uploadDropped = async (dropped: File[]) => {
    const pictures = dropped.filter((file) => file.type.startsWith('image/'));
    const videos = dropped.filter((file) => file.type.startsWith('video/') || isMp4(file));
    if (pictures.length + videos.length < dropped.length) toast.error('Only photos and MP4 videos can go here.');
    if (pictures.length) await uploadPhotos(pictures);
    if (videos.length) await uploadVideos(videos);
  };

  const importCard = async () => {
    setBusy({ label: 'Importing your Access card photos', fraction: null });
    try {
      const res = await importMyCardMedia();
      const added = Array.isArray(res?.data?.rows) ? res.data.rows.length : 0;
      toast.success(
        added ? `${plural(added, 'item')} imported from your Access card.` : "Your Access card's photos are already here."
      );
    } catch (err) {
      toast.error(ownerError(err, "We couldn't import your Access card photos.").message);
    } finally {
      setBusy(null);
      refresh();
    }
  };

  const remove = async (item: OwnerMedia) => {
    const name = nameOf(item);
    if (!window.confirm(`Delete this ${name} from your page? This can't be undone.`)) return;
    setRemoving(item.id);
    try {
      await deleteMyMedia(item.id);
      setItems((list) => list.filter((row) => row.id !== item.id));
      toast.success(`The ${name} is deleted.`);
    } catch (err) {
      toast.error(ownerError(err, `We couldn't delete this ${name}.`).message);
    } finally {
      setRemoving(null);
    }
  };

  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes('Files');

  const dropZone =
    load.status === 'ready' && !locked
      ? {
          onDragOver: (event: DragEvent<HTMLDivElement>) => {
            if (!hasFiles(event)) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            setFilesOver(true);
          },
          onDragLeave: (event: DragEvent<HTMLDivElement>) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFilesOver(false);
          },
          onDrop: (event: DragEvent<HTMLDivElement>) => {
            if (!hasFiles(event)) return;
            event.preventDefault();
            setFilesOver(false);
            void uploadDropped(Array.from(event.dataTransfer.files));
          },
        }
      : {};

  const tileDrag = (index: number) =>
    locked
      ? {}
      : {
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
            event.stopPropagation();
            dragFrom.current = null;
            setDropAt(null);
            move(from, index);
          },
          onDragEnd: () => {
            dragFrom.current = null;
            setDropAt(null);
          },
        };

  const hiddenCount = items.filter((item) => item.is_hidden).length;
  // The page shows the first few items Glamlink hasn't hidden.
  const onPage = new Set(
    items
      .filter((item) => !item.is_hidden)
      .slice(0, SHOWN_ON_PAGE)
      .map((item) => item.id)
  );

  const header = (
    <div>
      <h2 className="text-lg font-semibold sm:text-xl">Media & Images</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Photos and videos for the Media & Images section of your page. Add as many as you like.
      </p>
    </div>
  );

  if (load.status === 'loading') {
    return (
      <div className="space-y-6">
        {header}
        <div className="flex justify-center p-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading your media" />
        </div>
      </div>
    );
  }
  if (load.status === 'unavailable') {
    return (
      <div className="space-y-6">
        {header}
        <UnavailablePanel message={load.message}>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your page shows your Access card&apos;s photos in the meantime. You&apos;ll be able to add your own here soon.
          </p>
        </UnavailablePanel>
      </div>
    );
  }
  if (load.status === 'error') {
    return (
      <div className="space-y-6">
        {header}
        <LoadErrorPanel
          message={load.message}
          onRetry={() => {
            setLoad({ status: 'loading' });
            refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div
      {...dropZone}
      className={`space-y-6 rounded-2xl transition-shadow ${filesOver ? 'ring-2 ring-secondary/40 ring-offset-4 ring-offset-card' : ''}`}
    >
      <div className="flex flex-col gap-4">
        {header}
        <div className="flex flex-wrap gap-2">
          <input
            id="media-photos"
            type="file"
            accept="image/*"
            multiple
            disabled={locked}
            className="peer/photos sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = '';
              if (files.length) void uploadPhotos(files);
            }}
          />
          <label
            htmlFor="media-photos"
            className={`btn-primary px-4 py-2 text-xs peer-focus-visible/photos:ring-2 peer-focus-visible/photos:ring-ring peer-focus-visible/photos:ring-offset-2 ${
              locked ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }`}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload photos
          </label>
          <input
            id="media-videos"
            type="file"
            accept="video/mp4,.mp4"
            multiple
            disabled={locked}
            className="peer/videos sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = '';
              if (files.length) void uploadVideos(files);
            }}
          />
          <label
            htmlFor="media-videos"
            className={`btn-outline px-4 py-2 text-xs peer-focus-visible/videos:ring-2 peer-focus-visible/videos:ring-ring peer-focus-visible/videos:ring-offset-2 ${
              locked ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }`}
          >
            <Film className="h-4 w-4" aria-hidden="true" />
            Upload a video
          </label>
          <button type="button" onClick={() => setAddingLink(true)} disabled={locked || addingLink} className="btn-outline px-4 py-2 text-xs disabled:opacity-50">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            Add a YouTube or Vimeo link
          </button>
          <button type="button" onClick={importCard} disabled={locked} className="btn-outline px-4 py-2 text-xs disabled:opacity-50">
            <Import className="h-4 w-4" aria-hidden="true" />
            Import my Access card photos
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Choose as many photos as you like at once. Videos: MP4, up to {MAX_UPLOAD_MB} MB each. You can also drop files
          here.
        </p>
      </div>

      {busy && <UploadProgressBar label={busy.label} fraction={busy.fraction} />}

      {addingLink && (
        <LinkForm
          onCancel={() => setAddingLink(false)}
          onAdded={() => {
            setAddingLink(false);
            refresh();
          }}
        />
      )}

      {items.length === 0 ? (
        <StatePanel icon={<Images className="h-6 w-6" aria-hidden="true" />} title="Your own photos and videos go here">
          <p className="max-w-md text-sm text-muted-foreground">
            Until you add your own, your page shows your Access card&apos;s photos. There&apos;s no limit here: add as many
            photos and videos as you like. Your Access card&apos;s gallery keeps its plan limits.
          </p>
          <p className="max-w-md text-xs text-muted-foreground">
            When you add your first one, your Access card&apos;s photos are copied in too, so you can keep, reorder or delete
            them.
          </p>
        </StatePanel>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {plural(items.length, 'item')}
              {hiddenCount > 0 && ` · ${hiddenCount} hidden by Glamlink`}. The first {SHOWN_ON_PAGE} show on your page, and
              the rest under View all. Drag to reorder, or use the arrows.
            </p>
            <OrderStatusNote status={order.status} />
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <MediaTile
                key={item.id}
                item={item}
                index={index}
                count={items.length}
                onPage={onPage.has(item.id)}
                locked={locked}
                removing={removing === item.id}
                dropTarget={dropAt === index}
                onMove={(to) => move(index, to)}
                onEdit={() => setEditing(item)}
                onRemove={() => remove(item)}
                dragProps={tileDrag(index)}
              />
            ))}
          </ul>
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing?.kind === 'video' ? 'Video details' : 'Photo details'}</DialogTitle>
            <DialogDescription>A caption shows with it on your page; alt text describes it.</DialogDescription>
          </DialogHeader>
          {editing && (
            <DetailsForm
              key={editing.id}
              item={editing}
              onCancel={() => setEditing(null)}
              onSaved={(saved) => {
                setItems((list) => list.map((row) => (row.id === saved.id ? saved : row)));
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
