import React, { useRef, useState } from "react";
import "./imageDropzone.css";

/**
 * Zona de carga de imagen con drag & drop + click para buscar.
 * Llama onFile(file) cuando se selecciona/suelta una imagen.
 */
const ImageDropzone = ({ preview, onFile }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (file) => {
    if (file && file.type?.startsWith("image/")) onFile(file);
  };

  return (
    <div
      className={`dropzone ${dragging ? "is-dragging" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {preview ? (
        <div className="dropzone__preview">
          <img src={preview} alt="preview" />
          <span className="dropzone__hint">
            Haz clic o arrastra para cambiar la imagen
          </span>
        </div>
      ) : (
        <div className="dropzone__empty">
          <i className="bi bi-images dropzone__icon" />
          <div className="fw-semibold">Arrastra y suelta una imagen aquí</div>
          <div className="text-muted small">
            o <span className="dropzone__link">busca un archivo</span> en tu equipo
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
