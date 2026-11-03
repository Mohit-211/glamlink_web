"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, Node, mergeAttributes, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { NodeSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import {
  Bold,
  Captions,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Undo2,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { readApiError } from "@/lib/apiError";
import { cn } from "@/lib/utils";

/*
 * The editor for longer writing, such as an Education blog post: H2 and H3,
 * bold, italic, lists, links, quotes and pictures inside the text. It is the
 * site's one editor library (Tiptap, like BioEditor) with more of it switched
 * on. It writes only what the API keeps (h2, h3, p, strong, em, lists, links,
 * blockquote, img); the API cleans the HTML again on save.
 */

/** A picture inside the text. Only http(s) links are kept, so pasted data: pictures are dropped. */
const BodyImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (el: HTMLElement) => (/^https?:\/\//i.test(el.getAttribute("src") ?? "") ? null : false),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
});

const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
  BodyImage,
];

// The written text, styled close to the post's own page. Joined as is: nothing here needs merging.
const CONTENT_CLASS = [
  "min-h-72 px-4 py-4 text-base leading-relaxed text-foreground outline-none",
  "[&>*+*]:mt-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li>p]:my-0",
  "[&_a]:text-primary [&_a]:underline",
  "[&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_img]:my-2 [&_img]:block [&_img]:h-auto [&_img]:max-h-[28rem] [&_img]:max-w-full [&_img]:rounded-xl",
  "[&_img.ProseMirror-selectednode]:outline-3 [&_img.ProseMirror-selectednode]:outline-offset-2 [&_img.ProseMirror-selectednode]:outline-secondary",
].join(" ");

/** Puts a picture at `pos`, or in place of the selection. Answers the position after it (for the next one). */
function insertPicture(view: EditorView, src: string, pos?: number): number | undefined {
  const { state } = view;
  const node = state.schema.nodes.image?.create({ src, alt: null });
  if (!node) return pos;
  if (pos === undefined) {
    view.dispatch(state.tr.replaceSelectionWith(node).scrollIntoView());
    return undefined;
  }
  // As ProseMirror drops a node: a picture dropped inside a paragraph lands beside it.
  const at = Math.max(0, Math.min(pos, state.doc.content.size));
  const tr = state.tr.replaceRangeWith(at, at, node);
  view.dispatch(tr.scrollIntoView());
  return tr.mapping.map(at);
}

const picturesIn = (files: FileList | null | undefined) =>
  Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));

interface Props {
  value: string;
  onChange: (html: string) => void;
  /** Uploads a picture and answers its link; throws an error written for people when it can't. */
  onUploadImage: (file: File) => Promise<string>;
  placeholder?: string;
  /** Names the text box for screen readers (the visible label's id). */
  labelledBy?: string;
  invalid?: boolean;
}

export default function ArticleEditor({ value, onChange, onUploadImage, placeholder, labelledBy, invalid }: Props) {
  const [uploading, setUploading] = useState(0);
  const pictureInput = useRef<HTMLInputElement>(null);

  // Uploads pictures one by one and puts each in the text as it arrives.
  const addPictures = async (view: EditorView, files: File[], at?: number) => {
    if (!files.length) return;
    setUploading((n) => n + files.length);
    let pos = at;
    for (const file of files) {
      try {
        const src = await onUploadImage(file);
        if (!view.isDestroyed) pos = insertPicture(view, src, pos);
      } catch (err) {
        toast.error(readApiError(err, "We couldn't upload this picture.").message);
      } finally {
        setUploading((n) => Math.max(0, n - 1));
      }
    }
  };

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: CONTENT_CLASS,
        role: "textbox",
        "aria-multiline": "true",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : { "aria-label": "Text" }),
        ...(invalid ? { "aria-invalid": "true" } : {}),
      },
      // Pictures pasted or dropped in are uploaded like the toolbar's.
      handlePaste: (view, event) => {
        const files = picturesIn(event.clipboardData?.files);
        if (!files.length) return false;
        event.preventDefault();
        void addPictures(view, files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = picturesIn(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void addPictures(view, files, at);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      // An empty doc serialises as "<p></p>"; report it as empty, as BioEditor does.
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  // Pick up a value set from outside after mount (a post loaded for editing).
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if ((value || "") !== current) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor && {
        h2: editor.isActive("heading", { level: 2 }),
        h3: editor.isActive("heading", { level: 3 }),
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        quote: editor.isActive("blockquote"),
        link: editor.isActive("link"),
        picture: editor.isActive("image"),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        isEmpty: editor.isEmpty,
      },
  });

  const chain = () => editor?.chain().focus();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-colors focus-within:border-primary",
        invalid ? "border-destructive" : "border-input"
      )}
    >
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5"
      >
        <ToolbarButton label="Heading" active={state?.h2} onClick={() => chain()?.toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Subheading" active={state?.h3} onClick={() => chain()?.toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton label="Bold" active={state?.bold} onClick={() => chain()?.toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={state?.italic} onClick={() => chain()?.toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton label="Bulleted list" active={state?.bulletList} onClick={() => chain()?.toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={state?.orderedList} onClick={() => chain()?.toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={state?.quote} onClick={() => chain()?.toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {editor && <LinkButton editor={editor} active={!!state?.link} />}
        <ToolbarButton
          label={uploading ? "Uploading a picture" : "Picture"}
          disabled={!editor}
          onClick={() => pictureInput.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </ToolbarButton>
        {editor && <AltTextButton editor={editor} enabled={!!state?.picture} />}

        <ToolbarDivider />

        <ToolbarButton label="Undo" disabled={!state?.canUndo} onClick={() => chain()?.undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" disabled={!state?.canRedo} onClick={() => chain()?.redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <input
        ref={pictureInput}
        type="file"
        accept="image/*"
        multiple
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(e) => {
          const files = picturesIn(e.target.files);
          e.target.value = "";
          if (editor && !editor.isDestroyed) void addPictures(editor.view, files);
        }}
      />

      <div className="relative">
        {state?.isEmpty && placeholder && (
          <p className="pointer-events-none absolute left-4 top-4 text-base text-muted-foreground">{placeholder}</p>
        )}
        <EditorContent editor={editor} />
      </div>
      {uploading > 0 && (
        <p role="status" className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          Uploading {uploading === 1 ? "a picture" : `${uploading} pictures`}…
        </p>
      )}
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor's selection when the toolbar is clicked.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
        active && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />;
}

const triggerClass = (active: boolean) =>
  cn(
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
    active && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
  );

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (next) setUrl(editor.getAttributes("link").href ?? "");
    setOpen(next);
  };

  const apply = () => {
    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    // Bare domains ("mysalon.com") become https links.
    if (!href) chain.unsetLink().run();
    else chain.setLink({ href: /^[a-z][a-z\d+.-]*:/i.test(href) ? href : `https://${href}` }).run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Link"
          title="Link"
          aria-pressed={active}
          onMouseDown={(e) => e.preventDefault()}
          className={triggerClass(active)}
        >
          <Link2 className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            apply();
          }}
          className="flex flex-col gap-2"
        >
          <input
            autoFocus
            type="text"
            inputMode="url"
            aria-label="Link address"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="input-glamlink h-9 rounded-md px-3 py-0"
          />
          <div className="flex justify-end gap-2">
            {active && (
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  setOpen(false);
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Unlink className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
            <button type="submit" className="btn-primary h-8 px-4 py-0 text-sm">
              Apply
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

/** Describes the selected picture (its alt text), for people who can't see it. */
function AltTextButton({ editor, enabled }: { editor: Editor; enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [alt, setAlt] = useState("");
  const [pos, setPos] = useState<number | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      const { selection } = editor.state;
      if (!(selection instanceof NodeSelection) || selection.node.type.name !== "image") return;
      setPos(selection.from);
      setAlt(String(selection.node.attrs.alt ?? ""));
    }
    setOpen(next);
  };

  const apply = () => {
    if (pos !== null && editor.state.doc.nodeAt(pos)?.type.name === "image") {
      editor.view.dispatch(editor.state.tr.setNodeAttribute(pos, "alt", alt.trim() || null));
    }
    setOpen(false);
    editor.commands.focus();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Picture description (alt text)"
          title="Picture description (alt text)"
          disabled={!enabled}
          onMouseDown={(e) => e.preventDefault()}
          className={triggerClass(false)}
        >
          <Captions className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            apply();
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="article-picture-alt" className="label-glamlink mb-0">
            Alt text
          </label>
          <input
            id="article-picture-alt"
            autoFocus
            value={alt}
            maxLength={255}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="What the picture shows"
            className="input-glamlink h-9 rounded-md px-3 py-0"
          />
          <div className="flex justify-end">
            <button type="submit" className="btn-primary h-8 px-4 py-0 text-sm">
              Apply
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
