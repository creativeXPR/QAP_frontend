import { useRef } from "react";
import { ImagePlus, FileCheck2, X } from "../../../lib/icons";

// NOTE: the design's helper text reads "Supports: JNG, PNG, PDF" — "JNG"
// looks like a typo for "JPG". Using "JPG, PNG, PDF" below; swap back if
// JNG was intentional (e.g. a specific internal format).
export default function AttachmentsStep({ files, onFilesChange, onBack, onContinue }) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    onFilesChange([...files, ...selected]);
  };

  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
        Attach supporting files (optional)
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Upload documents, screenshots, or photos that support your
        submission. This step is optional.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand/40 bg-brand/5 rounded-[10px] px-6 py-10 text-center hover:bg-brand/10"
      >
        <ImagePlus size={26} className="text-brand" />
        <span className="text-sm font-medium text-gray-900">
          Tap to Upload Files
        </span>
        <span className="text-xs text-gray-400">
          Supports: JPG, PNG, PDF · Max 1MB Each
        </span>
      </button>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 min-w-0">
                <FileCheck2 size={15} className="text-emerald-500 shrink-0" />
                <span className="truncate text-gray-700">{file.name}</span>
              </span>
              <button
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-500 shrink-0"
                aria-label="Remove file"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 text-base font-medium text-gray-600 border border-gray-300 rounded-[10px] py-2.5 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-brand hover:bg-brand-dark text-white text-base font-medium py-2.5 rounded-[10px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}