import { useState, useRef } from "react";

export default function ImageUploader({ preview, setPreview, image, setImage }) {
    const inputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files allowed");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Max file size is 2MB");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-400 transition"
        >

            {/* HIDDEN INPUT */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            {/* PREVIEW */}
            {preview ? (
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={preview}
                        alt="preview"
                        className="h-28 w-28 object-cover rounded-xl border"
                    />

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setImage(null);
                            setPreview(null);
                        }}
                        className="text-xs text-red-500 hover:underline"
                    >
                        Remove image
                    </button>
                </div>
            ) : (
                <div className="text-slate-400 text-sm">
                    Drag & drop image here <br />
                    <span className="text-xs">or click to upload</span>
                </div>
            )}
        </div>
    );
}