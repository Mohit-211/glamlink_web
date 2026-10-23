'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ExternalLink, ImagePlus, Loader2, Package, Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { createMyProduct, deleteMyProduct, getMyProducts, updateMyProduct } from '@/api/Api';
import { readApiError } from '@/lib/apiError';
import { formatPrice } from '@/lib/format';
import { productHref } from '@/lib/routes';
import type { ProductCard } from '@/lib/api/types';

/*
 * The owner's products (backend handoff, 10.14): /my/products. Published
 * products show on their page and in the shop at once; admins can still edit,
 * unpublish or remove them.
 */

type MyProduct = ProductCard & { status?: 'published' | 'draft'; description?: string | null };

const PER_PAGE = 10;

interface Draft {
  title: string;
  short_description: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  link: string;
  status: 'published' | 'draft';
  cover: File | null;
  coverPreview: string;
  removeCover: boolean;
}

const emptyDraft = (): Draft => ({
  title: '',
  short_description: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  link: '',
  status: 'published',
  cover: null,
  coverPreview: '',
  removeCover: false,
});

const draftFrom = (p: MyProduct): Draft => ({
  title: p.title ?? '',
  short_description: p.short_description ?? '',
  description: p.description ?? '',
  category: p.category ?? '',
  brand: p.brand ?? '',
  price: p.price === null || p.price === undefined ? '' : String(p.price),
  link: p.link ?? '',
  status: p.status === 'draft' ? 'draft' : 'published',
  cover: null,
  coverPreview: p.cover_image ?? '',
  removeCover: false,
});

function ProductForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: MyProduct | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => (editing ? draftFrom(editing) : emptyDraft()));
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFieldError(null);
    const form = new FormData();
    (['title', 'short_description', 'description', 'category', 'brand', 'price', 'link', 'status'] as const).forEach((key) =>
      form.append(key, String(draft[key]).trim())
    );
    if (draft.cover) form.append('images', draft.cover);
    else if (editing && draft.removeCover) form.append('cover_image', '');

    try {
      if (editing) await updateMyProduct(editing.id, form);
      else await createMyProduct(form);
      toast.success(editing ? 'Product saved.' : 'Product added.');
      onDone();
    } catch (err) {
      const error = readApiError(err, "We couldn't save this product.");
      const field = typeof error.details?.field === 'string' ? error.details.field : '';
      setFieldError(field ? { field, message: error.message } : null);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const errorFor = (field: string) =>
    fieldError?.field === field ? (
      <p role="alert" className="mt-1.5 text-xs text-destructive">
        {fieldError.message}
      </p>
    ) : null;

  const text = (key: 'title' | 'category' | 'brand' | 'link' | 'price', label: string, props: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={`product-${key}`} className="label-glamlink">
        {label}
      </label>
      <input
        id={`product-${key}`}
        value={draft[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={fieldError?.field === key || undefined}
        className="input-glamlink"
        {...props}
      />
      {errorFor(key)}
    </div>
  );

  const shownCover = draft.removeCover ? '' : draft.coverPreview;

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{editing ? 'Edit product' : 'Add a product'}</h3>
        <button type="button" onClick={onCancel} aria-label="Close" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-card">
          {shownCover ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local preview or the stored picture
            <img src={shownCover} alt="" className="h-full w-full object-contain p-2" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="product-cover" className="btn-outline cursor-pointer px-4 py-2 text-xs">
            Choose a photo
          </label>
          <input
            id="product-cover"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setDraft((d) => ({ ...d, cover: file, coverPreview: URL.createObjectURL(file), removeCover: false }));
              e.target.value = '';
            }}
          />
          {shownCover && (
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, cover: null, coverPreview: '', removeCover: true }))}
              className="link-glamlink text-left text-xs"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-muted-foreground">The product on a plain background works best.</p>
        </div>
      </div>
      {errorFor('images')}

      {text('title', 'Product name *', { required: true, maxLength: 255 })}

      <div>
        <label htmlFor="product-short" className="label-glamlink">
          Short description
        </label>
        <input
          id="product-short"
          value={draft.short_description}
          onChange={(e) => set('short_description', e.target.value)}
          placeholder="One line shown on product cards"
          aria-invalid={fieldError?.field === 'short_description' || undefined}
          className="input-glamlink"
        />
        {errorFor('short_description')}
      </div>

      <div>
        <label htmlFor="product-description" className="label-glamlink">
          Description
        </label>
        <textarea
          id="product-description"
          rows={5}
          value={draft.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What it is, who it's for and how to use it"
          aria-invalid={fieldError?.field === 'description' || undefined}
          className="input-glamlink resize-y"
        />
        {errorFor('description')}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {text('category', 'Category', { placeholder: 'Serums' })}
        {text('brand', 'Brand', { placeholder: 'Leave empty for your own brand' })}
        {text('price', 'Price (USD)', { inputMode: 'decimal', placeholder: '49.00', pattern: '^\\d+(\\.\\d{1,2})?$' })}
        {text('link', 'Where to buy (link)', { type: 'url', placeholder: 'https://' })}
      </div>

      <fieldset>
        <legend className="label-glamlink">Show it</legend>
        <div className="flex flex-wrap gap-2">
          {(['published', 'draft'] as const).map((status) => (
            <label key={status} className="chip cursor-pointer rounded-full px-4 py-2 text-sm">
              <input
                type="radio"
                name="product-status"
                value={status}
                checked={draft.status === status}
                onChange={() => set('status', status)}
                className="sr-only"
              />
              {status === 'published' ? 'On my page and in the shop' : 'Save as a draft'}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {editing ? 'Save product' : 'Add product'}
        </button>
        <button type="button" onClick={onCancel} className="link-glamlink text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ProductsTab() {
  const [rows, setRows] = useState<MyProduct[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState<MyProduct | null | 'new'>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    getMyProducts({ page, limit: PER_PAGE })
      .then((res) => {
        if (!active) return;
        setRows(Array.isArray(res?.data?.rows) ? res.data.rows : []);
        setCount(Number(res?.data?.count ?? 0));
        setLoadError('');
      })
      .catch((err) => {
        if (active) setLoadError(readApiError(err, "We couldn't load your products.").message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, reloadKey]);

  const remove = async (product: MyProduct) => {
    if (!window.confirm(`Remove “${product.title}” from your page and the shop?`)) return;
    try {
      await deleteMyProduct(product.id);
      toast.success('Product removed.');
      reload();
    } catch (err) {
      toast.error(readApiError(err, "We couldn't remove this product.").message);
    }
  };

  const pageCount = Math.max(1, Math.ceil(count / PER_PAGE));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Products you add show on your page and in the Glamlink shop.
          </p>
        </div>
        {editing === null && (
          <button type="button" onClick={() => setEditing('new')} className="btn-primary shrink-0 px-4 py-2 text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a product
          </button>
        )}
      </div>

      {editing !== null && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading your products" />
        </div>
      ) : loadError ? (
        <p className="text-sm text-muted-foreground">{loadError}</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary">
            <Package className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="font-semibold">No products yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add the products you make, sell or recommend. They appear on your page right away.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {rows.map((product) => {
            const price = formatPrice(product.price);
            const isDraft = product.status === 'draft';
            return (
              <li key={product.id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
                  {product.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element -- a thumbnail from the API
                    <img src={product.cover_image} alt="" className="h-full w-full object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[product.brand, product.category, price].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isDraft ? 'bg-muted text-muted-foreground' : 'bg-success/10 text-success'
                    }`}
                  >
                    {isDraft ? 'Draft' : 'Live'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!isDraft && product.slug && (
                    <Link
                      href={productHref(product)}
                      target="_blank"
                      aria-label={`See ${product.title} in the shop`}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-secondary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditing(product)}
                    aria-label={`Edit ${product.title}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(product)}
                    aria-label={`Remove ${product.title}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="link-glamlink disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="link-glamlink disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
