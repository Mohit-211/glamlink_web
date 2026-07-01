"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function BioEditor({ value, onChange, placeholder }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value || ""}
      config={{
        licenseKey: "GPL",
        placeholder: placeholder || "",
      }}
      onChange={(_, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}