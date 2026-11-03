'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Clapperboard, FileText, ImagePlus, Loader2, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import { createMyEducation, updateMyEducation, uploadMyProfileImage } from '@/api/Api';
import ArticleEditor from '@/components/editor/ArticleEditor';
import type { OwnerEducation } from '@/lib/api/profileContent';
import {
  FieldError,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  UploadProgressBar,
  isMp4,
  makePoster,
  ownerError,
  videoLink,
} from './shared';

/*
 * Adds or edits one Education post (POST and PUT /my/profile/education): a
 * video (a YouTube or Vimeo link, or an MP4 with a poster made here) or a blog
 * post written in ArticleEditor, with its pictures uploaded through
 * POST /my/profile/uploads.
 */

const TITLE_MAX = 150;
const SUMMARY_MAX = 300;

type Kind = OwnerEducation['kind'];
type Status = OwnerEducation['status'];

const KINDS: { value: Kind; label: string; icon: typeof Clapperboard }[] = [
  { value: 'video', label: 'Video', icon: Clapperboard },
  { value: 'article', label: 'Blog post', icon: FileText },
];

interface Picked {
  file: File | null;
  preview: string;
  removed: boolean;
}

interface Draft {
  kind: Kind;
  title: string;
  summary: string;
  status: Status;
  body: string;
  cover: Picked;
  videoMode: 'link' | 'upload';
  videoUrl: string;
  video: File | null;
  poster: File | null;
  posterPreview: string;
}

/** The post's own cover: a video's `cover_image` falls back to its thumbnail, which isn't one. */
const ownCover = (item: OwnerEducation | null) => {
  if (!item?.cover_image) return '';
  if (item.kind === 'video' && item.video?.thumbnail && item.cover_image === item.video.thumbnail) return '';
  return item.cover_image;
};

const linkOf = (item: OwnerEducation | null) => (item?.video && item.video.source !== 'upload' ? item.video.url : '');

const draftFrom = (item: OwnerEducation | null): Draft => ({
  kind: item?.kind === 'article' ? 'article' : 'video',
  title: item?.title ?? '',
  summary: item?.summary ?? '',
  status: item?.status === 'draft' ? 'draft' : 'published',
  body: item?.body ?? '',
  cover: { file: null, preview: ownCover(item), removed: false },
  videoMode: item?.video?.source === 'upload' ? 'upload' : 'link',
  videoUrl: linkOf(item),
  video: null,
  poster: null,
  posterPreview: '',
});

// Where a refusal shows: the API's field names, mapped to the form's.
const FIELD_SHOWN: Record<string, string> = { video_thumbnails: 'videos', images: 'cover_image' };
const ALWAYS_SHOWN = new Set(['kind', 'title', 'summary', 'status', 'cover_image']);

const megabytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;

/** A picture for the post's text, checked here and uploaded; errors come back written for people. */
async function uploadPicture(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`Pictures can be up to ${MAX_UPLOAD_MB} MB.`);
  try {
    return await uploadMyProfileImage(file);
  } catch (err) {
    throw new Error(ownerError(err, "We couldn't upload this picture.").message);
  }
}

export default function EducationForm({
  editing,
  onSaved,
  onCancel,
}: {
  editing: OwnerEducation | null;
  onSaved: (item: OwnerEducation | null) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => draftFrom(editing));
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);
  const top = useRef<HTMLFormElement>(null);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  // Opening the form for a post further down the list brings it into view.
  useEffect(() => {
    const box = top.current?.getBoundingClientRect();
    if (box && (box.top < 0 || box.top > window.innerHeight * 0.6)) {
      top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const fail = (field: string, message: string): false => {
    setError({ field, message });
    return false;
  };

  const pickVideo = async (file: File) => {
    if (!isMp4(file)) return fail('videos', 'Videos need to be MP4 files.');
    if (file.size > MAX_UPLOAD_BYTES) return fail('videos', `Videos can be up to ${MAX_UPLOAD_MB} MB.`);
    setError(null);
    setPreparing(true);
    try {
      const poster = await makePoster(file);
      setDraft((d) => ({ ...d, video: file, poster, posterPreview: URL.createObjectURL(poster) }));
    } catch {
      fail('videos', "We couldn't read this video. Try exporting it again as an MP4.");
    } finally {
      setPreparing(false);
    }
  };

  /** The video fields to send, or false (with the error shown) when the video part isn't ready. */
  const videoFields = (): Record<string, string | File> | false => {
    if (draft.kind !== 'video') return {};
    const wasUpload = editing?.video?.source === 'upload';
    if (draft.videoMode === 'link') {
      const original = linkOf(editing);
      if (editing?.kind === 'video' && !wasUpload && draft.videoUrl.trim() === original) return {};
      const link = videoLink(draft.videoUrl);
      if (!link) return fail('video_url', 'Paste a link to the video on YouTube or Vimeo.');
      return { video_url: link.url };
    }
    if (draft.video && draft.poster) return { videos: draft.video, video_thumbnails: draft.poster };
    if (editing?.kind === 'video' && wasUpload) return {};
    return fail('videos', 'Choose a video to upload.');
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!draft.title.trim()) {
      fail('title', 'Give your post a title.');
      return;
    }
    if (draft.kind === 'article' && draft.status === 'published' && !draft.body.trim()) {
      fail('body', 'Write your post before publishing it, or save it as a draft.');
      return;
    }
    const video = videoFields();
    if (video === false) return;

    const form = new FormData();
    form.append('kind', draft.kind);
    form.append('title', draft.title.trim());
    form.append('summary', draft.summary.trim());
    form.append('status', draft.status);
    // An unchanged body stays as it is (the update is partial).
    if (draft.kind === 'article' && (!editing || editing.kind !== 'article' || draft.body !== (editing.body ?? ''))) {
      form.append('body', draft.body);
    }
    Object.entries(video).forEach(([key, value]) => form.append(key, value));
    if (draft.cover.file) form.append('images', draft.cover.file);
    else if (editing && draft.cover.removed) form.append('cover_image', '');

    const uploading = Boolean(draft.cover.file || draft.video);
    setSaving(true);
    setProgress(uploading ? 0 : null);
    try {
      const onProgress = uploading ? (fraction: number) => setProgress(fraction) : undefined;
      const res = editing ? await updateMyEducation(editing.id, form, onProgress) : await createMyEducation(form, onProgress);
      toast.success(
        draft.status === 'draft' ? 'Draft saved.' : editing ? 'Post saved.' : 'Post published on your page.'
      );
      onSaved(res?.data && typeof res.data === 'object' ? res.data : null);
    } catch (err) {
      const { message, field } = ownerError(err, "We couldn't save this post.");
      setError({ field: placeOf(field), message });
      toast.error(message);
    } finally {
      setSaving(false);
      setProgress(null);
    }
  };

  /** The field on screen that a refusal belongs under; anything else shows above the buttons. */
  const placeOf = (field: string) => {
    const shown = FIELD_SHOWN[field] ?? field;
    if (ALWAYS_SHOWN.has(shown)) return shown;
    if (draft.kind === 'video' && (shown === 'video_url' || shown === 'videos')) {
      return draft.videoMode === 'link' ? 'video_url' : 'videos';
    }
    if (draft.kind === 'article' && shown === 'body') return 'body';
    return 'form';
  };

  const errorFor = (field: string) => <FieldError message={error?.field === field ? error.message : null} />;
  const invalid = (field: string) => error?.field === field || undefined;

  const shownCover = draft.cover.removed ? '' : draft.cover.preview;
  const coverFallback = draft.kind === 'video' ? draft.posterPreview || editing?.video?.thumbnail || '' : '';
  const currentUpload = editing?.kind === 'video' && editing.video?.source === 'upload' ? editing.video : null;

  return (
    <form ref={top} onSubmit={onSubmit} className="scroll-mt-24 space-y-6 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{editing ? 'Edit post' : 'Add a post'}</h3>
        <button type="button" onClick={onCancel} aria-label="Close" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <fieldset>
        <legend className="label-glamlink">Kind</legend>
        <div className="flex flex-wrap gap-2">
          {KINDS.map(({ value, label, icon: Icon }) => (
            <label key={value} className="chip inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm">
              <input
                type="radio"
                name="education-kind"
                value={value}
                checked={draft.kind === value}
                onChange={() => set('kind', value)}
                className="sr-only"
              />
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </label>
          ))}
        </div>
        {errorFor('kind')}
      </fieldset>

      <div>
        <label htmlFor="education-title" className="label-glamlink">
          Title *
        </label>
        <input
          id="education-title"
          required
          maxLength={TITLE_MAX}
          value={draft.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder={draft.kind === 'video' ? 'How to prep skin before a facial' : 'Five things your skin needs in winter'}
          aria-invalid={invalid('title')}
          className="input-glamlink"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {draft.title.length}/{TITLE_MAX}
        </p>
        {errorFor('title')}
      </div>

      <div>
        <label htmlFor="education-summary" className="label-glamlink">
          Summary
        </label>
        <textarea
          id="education-summary"
          rows={3}
          maxLength={SUMMARY_MAX}
          value={draft.summary}
          onChange={(e) => set('summary', e.target.value)}
          placeholder="A line or two shown on the post's card"
          aria-invalid={invalid('summary')}
          className="input-glamlink resize-y"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {draft.summary.length}/{SUMMARY_MAX}
        </p>
        {errorFor('summary')}
      </div>

      {draft.kind === 'video' && (
        <fieldset className="space-y-4">
          <legend className="label-glamlink">Video *</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['link', 'YouTube or Vimeo link'],
                ['upload', 'Upload a video'],
              ] as const
            ).map(([mode, label]) => (
              <label key={mode} className="chip cursor-pointer rounded-full px-4 py-2 text-sm">
                <input
                  type="radio"
                  name="education-video-mode"
                  value={mode}
                  checked={draft.videoMode === mode}
                  onChange={() => set('videoMode', mode)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>

          {draft.videoMode === 'link' ? (
            <div>
              <label htmlFor="education-video-url" className="sr-only">
                Video link
              </label>
              <input
                id="education-video-url"
                type="text"
                inputMode="url"
                autoComplete="off"
                value={draft.videoUrl}
                onChange={(e) => set('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                aria-invalid={invalid('video_url')}
                className="input-glamlink"
              />
              {errorFor('video_url')}
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                  {draft.posterPreview || currentUpload?.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a local poster or the stored one
                    <img src={draft.posterPreview || currentUpload?.thumbnail || ''} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                      <Clapperboard className="h-6 w-6" aria-hidden="true" />
                    </span>
                  )}
                  {(draft.posterPreview || currentUpload) && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-overlay/55 text-overlay-foreground">
                        <Play className="h-4 w-4 translate-x-px" aria-hidden="true" />
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <input
                    id="education-video-file"
                    type="file"
                    accept="video/mp4,.mp4"
                    className="peer sr-only"
                    disabled={preparing}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) void pickVideo(file);
                    }}
                  />
                  <label
                    htmlFor="education-video-file"
                    className={`btn-outline px-4 py-2 text-xs peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${
                      preparing ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    {preparing && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    {draft.video || currentUpload ? 'Choose another video' : 'Choose a video'}
                  </label>
                  <p className="truncate text-xs text-muted-foreground">
                    {preparing
                      ? 'Making a poster from your video…'
                      : draft.video
                        ? `${draft.video.name} (${megabytes(draft.video.size)}). The poster is a frame from the video.`
                        : currentUpload
                          ? 'Your current video stays unless you choose another.'
                          : `MP4, up to ${MAX_UPLOAD_MB} MB. We make its poster from a frame.`}
                  </p>
                </div>
              </div>
              {errorFor('videos')}
            </div>
          )}
        </fieldset>
      )}

      <div>
        <span className="label-glamlink">Cover image</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
            {shownCover ? (
              // eslint-disable-next-line @next/next/no-img-element -- a local preview or the stored picture
              <img src={shownCover} alt="" className="h-full w-full object-cover" />
            ) : coverFallback ? (
              // eslint-disable-next-line @next/next/no-img-element -- the video's poster, shown as the fallback
              <img src={coverFallback} alt="" className="h-full w-full object-cover opacity-60" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                <ImagePlus className="h-6 w-6" aria-hidden="true" />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              id="education-cover"
              type="file"
              accept="image/*"
              className="peer sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                if (file.size > MAX_UPLOAD_BYTES) {
                  fail('cover_image', `Pictures can be up to ${MAX_UPLOAD_MB} MB.`);
                  return;
                }
                set('cover', { file, preview: URL.createObjectURL(file), removed: false });
              }}
            />
            <label
              htmlFor="education-cover"
              className="btn-outline cursor-pointer px-4 py-2 text-xs peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
            >
              Choose image
            </label>
            {shownCover && (
              <button
                type="button"
                onClick={() => set('cover', { file: null, preview: '', removed: true })}
                className="link-glamlink text-left text-xs"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {draft.kind === 'video'
            ? "Shown on the post's card. Empty: the video's poster."
            : "Shown on the post's card and at the top of the post."}
        </p>
        {errorFor('cover_image')}
      </div>

      {draft.kind === 'article' && (
        <div>
          <span id="education-body-label" className="label-glamlink">
            Post *
          </span>
          <ArticleEditor
            value={draft.body}
            onChange={(html) => set('body', html)}
            onUploadImage={uploadPicture}
            labelledBy="education-body-label"
            invalid={error?.field === 'body'}
            placeholder="Write your post. Add headings, lists, links, quotes and pictures from the toolbar."
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Pictures go where your cursor is; you can also paste or drop them in. Select a picture to add its alt text.
          </p>
          {errorFor('body')}
        </div>
      )}

      <fieldset>
        <legend className="label-glamlink">Show it</legend>
        <div className="flex flex-wrap gap-2">
          {(['published', 'draft'] as const).map((status) => (
            <label key={status} className="chip cursor-pointer rounded-full px-4 py-2 text-sm">
              <input
                type="radio"
                name="education-status"
                value={status}
                checked={draft.status === status}
                onChange={() => set('status', status)}
                className="sr-only"
              />
              {status === 'published' ? 'Publish on my page' : 'Save as a draft'}
            </label>
          ))}
        </div>
        {errorFor('status')}
      </fieldset>

      {saving && progress !== null && (
        <UploadProgressBar label={draft.video ? 'Uploading your video' : 'Uploading'} fraction={progress} />
      )}
      {errorFor('form')}

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button type="submit" className="btn-primary" disabled={saving || preparing}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {draft.status === 'draft' ? 'Save draft' : editing ? 'Save post' : 'Publish post'}
        </button>
        <button type="button" onClick={onCancel} className="link-glamlink text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
