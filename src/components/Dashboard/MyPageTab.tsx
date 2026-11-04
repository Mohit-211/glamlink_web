'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, EyeOff, Globe, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile, userSpecialtiesApi } from '@/api/Api';
import BioEditor from '@/components/glamcard/GlamCardForm/LocationsSection/Bioeditor';
import { readApiError } from '@/lib/apiError';
import { BRAND_CATEGORIES, SHIPPING_OPTIONS } from '@/lib/api/profileContent';
import { profileHref } from '@/lib/routes';
import type { ProfileDetail, SocialLink } from '@/lib/api/types';
import { NativeSelect } from '@/components/ui/native-select';

/*
 * The owner's public page (/profiles/<slug>), from GET/PUT /my/profile (backend
 * handoff, 10.6). What is left empty here falls back to the Access card.
 * Intro, category, shipping and the about image (contract of Nov 3) show once
 * the API answers them in `page`; until then they say so and aren't sent.
 */

interface PageFields {
  tagline: string | null;
  about: string | null;
  website: string | null;
  social: SocialLink[] | null;
  image: string | null;
  cover_image: string | null;
  intro: string | null;
  category: string | null;
  shipping: string | null;
  about_image: string | null;
}

/** The public view, with the Nov 3 fields while the shared type catches up. */
type PublicPage = ProfileDetail & { intro?: string | null; about_image?: string | null };

interface MyProfile {
  user_id: number;
  slug: string;
  page: Partial<PageFields> | null;
  visible: boolean;
  hidden_because: 'no_live_card' | 'unlisted' | null;
  public: PublicPage | null;
}

const MAX_SOCIAL = 10;
const TAGLINE_MAX = 150;
const INTRO_MAX = 300;

/** The Nov 3 fields, each offered once the API answers it in `page`. */
const NEW_FIELDS = [
  { key: 'intro', label: 'intro' },
  { key: 'category', label: 'category' },
  { key: 'shipping', label: 'shipping' },
  { key: 'about_image', label: 'about image' },
] as const;
type NewField = (typeof NEW_FIELDS)[number]['key'];

const offers = (page: MyProfile['page'], key: NewField) => !!page && Object.prototype.hasOwnProperty.call(page, key);

const listOf = (words: string[]) =>
  words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;

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
  landscape,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  pick: ImagePick;
  fallback?: string | null;
  wide?: boolean;
  landscape?: boolean;
  onChange: (pick: ImagePick) => void;
}) {
  const shown = pick.removed ? fallback : pick.preview || fallback;
  return (
    <div>
      <span className="label-glamlink">{label}</span>
      <div className="flex items-center gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border border-border bg-muted ${
            wide ? 'aspect-3/1 w-56' : landscape ? 'aspect-4/3 w-28' : 'h-20 w-20'
          }`}
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
  const [intro, setIntro] = useState('');
  const [category, setCategory] = useState('');
  const [shipping, setShipping] = useState('');
  const [aboutImage, setAboutImage] = useState<ImagePick>(noPick(null));
  // The specialties a professional's category is picked from; null until they load.
  const [specialties, setSpecialties] = useState<string[] | null>(null);
  const [specialtiesFailed, setSpecialtiesFailed] = useState(false);

  const fill = (data: MyProfile) => {
    setProfile(data);
    const page = data.page ?? {};
    setTagline(page.tagline ?? '');
    setAbout(page.about ?? '');
    setWebsite(page.website ?? '');
    setSocial(page.social ?? []);
    setLogo(noPick(page.image));
    setCover(noPick(page.cover_image));
    setIntro(page.intro ?? '');
    setCategory(page.category ?? '');
    setShipping(page.shipping ?? '');
    setAboutImage(noPick(page.about_image));
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

  const isBrand = profile?.public?.type === 'brand';
  const wantsSpecialties = !!profile && !isBrand && offers(profile.page, 'category');
  useEffect(() => {
    if (!wantsSpecialties) return;
    let active = true;
    userSpecialtiesApi()
      .then((res) => {
        const rows: unknown[] = Array.isArray(res?.data?.rows) ? res.data.rows : [];
        const names = rows
          .map((row) => {
            if (typeof row === 'string') return row;
            const item = row as { name?: unknown; title?: unknown } | null;
            return String(item?.name ?? item?.title ?? '');
          })
          .map((name) => name.trim())
          // A category is at most 60 characters.
          .filter((name) => name && name.length <= 60);
        if (active) setSpecialties(Array.from(new Set(names)));
      })
      .catch(() => {
        if (!active) return;
        setSpecialties([]);
        setSpecialtiesFailed(true);
      });
    return () => {
      active = false;
    };
  }, [wantsSpecialties]);

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
    // The Nov 3 fields go only to an API that has them (an older one refuses an unknown file field).
    const page = profile?.page ?? null;
    if (offers(page, 'intro')) form.append('intro', intro.trim());
    if (offers(page, 'category')) form.append('category', category);
    if (offers(page, 'shipping')) form.append('shipping', shipping);
    if (offers(page, 'about_image')) {
      if (aboutImage.file) form.append('about_image', aboutImage.file);
      else if (aboutImage.removed) form.append('about_image', '');
    }

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
  const can = (key: NewField) => offers(profile.page, key);
  const missing = NEW_FIELDS.filter(({ key }) => !can(key)).map(({ label }) => label);
  const missingNote = listOf(missing);

  // A brand picks from the brand categories, a professional from the specialties; a saved value off the list stays.
  const categoryOptions: { value: string; label: string }[] = isBrand
    ? BRAND_CATEGORIES.map((c) => ({ value: c.key, label: `${c.label} Brand` }))
    : (specialties ?? []).map((name) => ({ value: name, label: name }));
  if (category && !categoryOptions.some((option) => option.value === category)) {
    categoryOptions.unshift({ value: category, label: category });
  }

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
          {card?.type && (
            <p className="mt-2 text-xs text-muted-foreground">
              Listed as a {card.type === 'brand' ? 'brand' : 'beauty or wellness professional'}. To change this,
              contact support.
            </p>
          )}
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

      {missing.length > 0 && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
        >
          <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {missingNote.charAt(0).toUpperCase() + missingNote.slice(1)} {missing.length === 1 ? "isn't" : "aren't"} available
            yet. You&apos;ll be able to set {missing.length === 1 ? 'it' : 'them'} here soon.
          </span>
        </p>
      )}

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

      {can('intro') && (
        <div>
          <label htmlFor="page-intro" className="label-glamlink">
            Intro
          </label>
          <textarea
            id="page-intro"
            rows={3}
            value={intro}
            maxLength={INTRO_MAX}
            onChange={(e) => setIntro(e.target.value)}
            placeholder={card?.intro || 'A sentence or two about what you do'}
            aria-invalid={fieldError?.field === 'intro' || undefined}
            className="input-glamlink resize-y"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {intro.length}/{INTRO_MAX}. Shown over your cover image, under your name. Empty: your Access card bio.
          </p>
          {errorFor('intro')}
        </div>
      )}

      <div>
        <span className="label-glamlink">About</span>
        <BioEditor value={about} onChange={setAbout} placeholder="Tell clients about your work, your story and what to expect." />
        <p className="mt-1.5 text-xs text-muted-foreground">Up to 2,000 characters of text.</p>
        {errorFor('about')}
      </div>

      {can('about_image') && (
        <div>
          <ImageField
            id="page-about-image"
            label="About image"
            hint="Shown beside your About text. Empty: your first photo in Media & Images, else your Access card's cover photo."
            pick={aboutImage}
            fallback={card?.about_image && card.about_image !== profile.page?.about_image ? card.about_image : null}
            landscape
            onChange={setAboutImage}
          />
          {errorFor('about_image')}
        </div>
      )}

      {(can('category') || can('shipping')) && (
        <fieldset>
          <legend className="text-sm font-semibold">Quick Info</legend>
          <p className="mb-4 mt-1 text-xs text-muted-foreground">Lines in the Quick Info box on your page.</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {can('category') && (
              <div>
                <label htmlFor="page-category" className="label-glamlink">
                  Category
                </label>
                <NativeSelect
                  id="page-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={!isBrand && specialties === null}
                  aria-invalid={fieldError?.field === 'category' || undefined}
                  className="input-glamlink"
                >
                  <option value="">{!isBrand && specialties === null ? 'Loading specialties…' : 'Not set'}</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {isBrand
                    ? 'What kind of brand you are, as in “Skincare Brand”. Also shown under your name.'
                    : specialtiesFailed
                      ? "We couldn't load the specialties. Try again later."
                      : 'Your main specialty. Also shown under your name.'}
                </p>
                {errorFor('category')}
              </div>
            )}
            {can('shipping') && (
              <div>
                <label htmlFor="page-shipping" className="label-glamlink">
                  Shipping
                </label>
                <NativeSelect
                  id="page-shipping"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  aria-invalid={fieldError?.field === 'shipping' || undefined}
                  className="input-glamlink"
                >
                  <option value="">Not set</option>
                  {SHIPPING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
                <p className="mt-1.5 text-xs text-muted-foreground">Whether and how far you ship.</p>
                {errorFor('shipping')}
              </div>
            )}
          </div>
        </fieldset>
      )}

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
