/* eslint-disable no-multi-str */
import React, { forwardRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./style.css";
const TextEditor = forwardRef(({ value, onChange, menubar = true, ref }) => {
  const handleEditorChange = (content) => {
    onChange(content);
  };

  const editorConfig = {
    height: 300,
    menubar: menubar,
    language: "pt_BR",
    branding: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "print",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "table",
      "paste",
      "textcolor",
    ],
    toolbar:
      "fullscreen | undo redo | formatselect | bold italic forecolor backcolor | \
      alignleft aligncenter alignright alignjustify | image | media | \
      bullist numlist outdent indent | removeformat | table | help",
    media_dimensions: {
      width: "100%",
      height: "auto",
    },
    content_style:
      "iframe { width: 100%; height: 100%; } \
      .tox.tox-tinymce-aux, .tox-fullscreen .tox.tox-tinymce-aux { z-index: 65537 !important; }",
    images_upload_max_size: 5 * 1024 * 1024,
    images_upload_handler: (blobInfo) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject("Failed to upload image");
        };
        reader.readAsDataURL(blobInfo.blob());
      });
    },
  };

  return (
    <Editor
      onEditorChange={handleEditorChange}
      value={value}
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
      init={editorConfig}
      ref={ref}
      style={{ width: "100%" }}
    />
  );
});

export default TextEditor;
