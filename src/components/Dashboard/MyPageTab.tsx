'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ExternalLink, EyeOff, Globe, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile } from '@/api/Api';
import BioEditor from '@/components/glamcard/GlamCardForm/LocationsSection/Bioeditor';
import { readApiError } from '@/lib/apiError';
import { profileHref } from '@/lib/routes';
import type { ProfileDetail, SocialLink } from '@/lib/api/types';

/*
 * The owner's public page (/profiles/<slug>), from GET/PUT /my/profile (backend
 * handoff, 10.6). What is left empty here falls back to the Access card.
 */

interface PageFields {
  tagline: string | null;
  about: string | null;
  website: string | null;
  social: SocialLink[] | null;
  image: string | null;
  cover_image: string | null;
}

interface MyProfile {
  user_id: number;
  slug: string;
  page: Partial<PageFields> | null;
  visible: boolean;
  hidden_because: 'no_live_card' | 'unlisted' | null;
  public: ProfileDetail | null;
}

const MAX_SOCIAL = 10;
const TAGLINE_MAX = 150;

interface ImagePick {
  file: File | null;
  preview: string;
  removed: boolean;
}

const noPick = (url: string | null | undefined): ImagePick => ({ file: null, preview: url ?? '', removed: false });

function ImageField({
  id,
  label,
  hint,
  pick,
  fallback,
  wide,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  pick: ImagePick;
  fallback?: string | null;
  wide?: boolean;
  onChange: (pick: ImagePick) => void;
}) {
  const shown = pick.removed ? fallback : pick.preview || fallback;
  return (
    <div>
      <span className="label-glamlink">{label}</span>
      <div className="flex items-center gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border border-border bg-muted ${wide ? 'aspect-3/1 w-56' : 'h-20 w-20'}`}
        >
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local preview or the stored picture
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={id} className="btn-outline cursor-pointer px-4 py-2 text-xs">
            Choose image
          </label>
          <input
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange({ file, preview: URL.createObjectURL(file), removed: false });
              e.target.value = '';
            }}
          />
          {(pick.preview || pick.file) && !pick.removed && (
            <button
              type="button"
              onClick={() => onChange({ file: null, preview: '', removed: true })}
              className="link-glamlink text-left text-xs"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function MyPageTab() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);

  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [website, setWebsite] = useState('');
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [logo, setLogo] = useState<ImagePick>(noPick(null));
  const [cover, setCover] = useState<ImagePick>(noPick(null));

  const fill = (data: MyProfile) => {
    setProfile(data);
    const page = data.page ?? {};
    setTagline(page.tagline ?? '');
    setAbout(page.about ?? '');
    setWebsite(page.website ?? '');
    setSocial(page.social ?? []);
    setLogo(noPick(page.image));
    setCover(noPick(page.cover_image));
  };

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((res) => {
        if (active && res?.data) fill(res.data as MyProfile);
      })
      .catch((err) => {
        if (active) setLoadError(readApiError(err, "We couldn't load your page.").message);
      });
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFieldError(null);
    const form = new FormData();
    form.append('tagline', tagline.trim());
    form.append('about', about);
    form.append('website', website.trim());
    form.append('social', JSON.stringify(social.filter((s) => s.url.trim()).map((s) => ({ title: s.title?.trim() || null, url: s.url.trim() }))));
    if (logo.file) form.append('profile_image', logo.file);
    else if (logo.removed) form.append('image', '');
    if (cover.file) form.append('images', cover.file);
    else if (cover.removed) form.append('cover_image', '');

    try {
      const res = await updateMyProfile(form);
      if (res?.data) fill(res.data as MyProfile);
      toast.success('Your page is saved.');
    } catch (err) {
      const error = readApiError(err, "We couldn't save your page.");
      const field = typeof error.details?.field === 'string' ? error.details.field : '';
      setFieldError(field ? { field, message: error.message } : null);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return <p className="p-6 text-sm text-muted-foreground">{loadError}</p>;
  }
  if (!profile) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading your page" />
      </div>
    );
  }

  const card = profile.public;
  const errorFor = (field: string) =>
    fieldError?.field === field ? (
      <p role="alert" className="mt-1.5 text-xs text-destructive">
        {fieldError.message}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">My Page</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your page on Glamlink: what clients and brands see when they find you.
          </p>
        </div>
        {profile.visible && (
          <Link href={profileHref(profile.slug)} target="_blank" className="btn-outline shrink-0 px-4 py-2 text-xs">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            View my page
          </Link>
        )}
      </div>

      <p
        role="status"
        className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
          profile.visible ? 'border-success/30 bg-success/5 text-success' : 'border-warning/40 bg-warning/10 text-warning-foreground'
        }`}
      >
        {profile.visible ? (
          <Globe className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <EyeOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        {profile.visible
          ? 'Your page is live.'
          : profile.hidden_because === 'unlisted'
            ? 'Glamlink has hidden your page. Write to support@glamlink.net to bring it back.'
            : 'Your page goes live once your Access card is live.'}
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageField
          id="page-logo"
          label="Logo or photo"
          hint="Square works best. Empty: your Access card photo."
          pick={logo}
          fallback={card?.image}
          onChange={setLogo}
        />
        <ImageField
          id="page-cover"
          label="Cover image"
          hint="A wide picture across the top of your page."
          pick={cover}
          fallback={card?.cover_image}
          wide
          onChange={setCover}
        />
      </div>
      {errorFor('profile_image')}
      {errorFor('images')}

      <div>
        <label htmlFor="page-tagline" className="label-glamlink">
          Tagline
        </label>
        <input
          id="page-tagline"
          value={tagline}
          maxLength={TAGLINE_MAX}
          onChange={(e) => setTagline(e.target.value)}
          placeholder={card?.tagline || 'One line about what you do'}
          aria-invalid={fieldError?.field === 'tagline' || undefined}
          className="input-glamlink"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {tagline.length}/{TAGLINE_MAX}. Empty: your Access card title.
        </p>
        {errorFor('tagline')}
      </div>

      <div>
        <span className="label-glamlink">About</span>
        <BioEditor value={about} onChange={setAbout} placeholder="Tell clients about your work, your story and what to expect." />
        <p className="mt-1.5 text-xs text-muted-foreground">Up to 2,000 characters of text.</p>
        {errorFor('about')}
      </div>

      <div>
        <label htmlFor="page-website" className="label-glamlink">
          Website
        </label>
        <input
          id="page-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder={card?.website || 'https://'}
          aria-invalid={fieldError?.field === 'website' || undefined}
          className="input-glamlink"
        />
        {errorFor('website')}
      </div>

      <fieldset>
        <legend className="label-glamlink">Social links</legend>
        <p className="mb-3 text-xs text-muted-foreground">None here: your Access card&apos;s links show instead.</p>
        <ul className="space-y-2">
          {social.map((link, i) => (
            <li key={i} className="flex gap-2">
              <input
                aria-label={`Link ${i + 1} name`}
                value={link.title ?? ''}
                onChange={(e) => setSocial((list) => list.map((l, j) => (j === i ? { ...l, title: e.target.value } : l)))}
                placeholder="Instagram"
                className="input-glamlink w-36 shrink-0"
              />
              <input
                aria-label={`Link ${i + 1} address`}
                type="url"
                value={link.url}
                onChange={(e) => setSocial((list) => list.map((l, j) => (j === i ? { ...l, url: e.target.value } : l)))}
                placeholder="https://instagram.com/you"
                className="input-glamlink flex-1"
              />
              <button
                type="button"
                aria-label={`Remove link ${i + 1}`}
                onClick={() => setSocial((list) => list.filter((_, j) => j !== i))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        {social.length < MAX_SOCIAL && (
          <button
            type="button"
            onClick={() => setSocial((list) => [...list, { title: '', url: '' }])}
            className="link-glamlink mt-3 inline-flex items-center gap-1.5 text-sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a link
          </button>
        )}
        {errorFor('social')}
      </fieldset>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save my page
        </button>
      </div>
    </form>
  );
}
