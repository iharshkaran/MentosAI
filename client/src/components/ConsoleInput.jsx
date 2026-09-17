import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, ArrowUp, X, FileText, Link2, Paperclip } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Drop a file, paste text, or paste a link...",
  "Turn this threat intel report into a LinkedIn post...",
  "Summarize this research paper for executives...",
  "Paste a YouTube link to transform a demo video...",
];

const ConsoleInput = ({ file, setFile, text, setText, onSubmit, disabled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const textareaRef = useRef(null);

  // Rotating placeholder
  useEffect(() => {
    if (text || file) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PROMPTS.length);
        setFade(true);
      }, 300); // Slightly smoother fade transition
    }, 4000); // Slowed down slightly for better readability
    return () => clearInterval(interval);
  }, [text, file]);

  const onDrop = useCallback(
    (accepted) => {
      const selected = accepted[0];
      if (selected) setFile(selected);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() || file) onSubmit();
    }
  };

  // Auto-resize textarea logic
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Reset textarea height when cleared
  useEffect(() => {
    if (!text && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  const handleAddLink = () => {
    setMenuOpen(false);
    textareaRef.current?.focus();
  };

  const handleAttachClick = () => {
    setMenuOpen(false);
    open();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Subtle animated background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-50 animate-pulse -z-10" />

      <div
        {...getRootProps()}
        className={`relative rounded-3xl bg-zinc-900/80 backdrop-blur-xl border transition-all duration-500 p-4 flex flex-col gap-2 ${
          isDragActive
            ? "border-teal-400/80 shadow-[0_0_40px_rgba(45,212,191,0.2)]"
            : "border-white/10 shadow-2xl focus-within:border-teal-500/50 focus-within:shadow-[0_8px_40px_rgba(45,212,191,0.12)] focus-within:bg-zinc-900"
        }`}
      >
        <input {...getInputProps()} />

        {/* Premium File Chip */}
        {file && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-200 text-sm rounded-xl px-3 py-2 w-fit group backdrop-blur-md">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
              <FileText size={16} />
            </div>
            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-zinc-500 hover:text-white transition-colors ml-1"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="relative flex-1 min-h-[44px] flex items-center">
          {!text && !file && (
            <div
              className={`absolute left-1 top-2 pointer-events-none text-zinc-500 text-[15px] font-medium transition-all duration-300 ${
                fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              }`}
            >
              {EXAMPLE_PROMPTS[placeholderIndex]}
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className="w-full bg-transparent text-zinc-100 text-[15px] leading-relaxed resize-none focus:outline-none font-body placeholder:text-zinc-600 py-2 px-1 max-h-[200px] overflow-y-auto custom-scrollbar"
          />
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="relative">
            {/* Redesigned Fan-out attach menu */}
            <div
              className={`absolute bottom-[calc(100%+12px)] left-0 flex flex-col gap-1.5 p-1.5 bg-zinc-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl transition-all duration-300 origin-bottom-left ${
                menuOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-90 translate-y-4 pointer-events-none"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAttachClick();
                }}
                type="button"
                className="flex items-center gap-3 hover:bg-white/10 text-zinc-300 hover:text-white text-sm font-medium rounded-xl px-3 py-2.5 whitespace-nowrap transition-colors"
              >
                <Paperclip size={16} className="text-zinc-400" /> Upload from computer
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddLink();
                }}
                type="button"
                className="flex items-center gap-3 hover:bg-white/10 text-zinc-300 hover:text-white text-sm font-medium rounded-xl px-3 py-2.5 whitespace-nowrap transition-colors"
              >
                <Link2 size={16} className="text-zinc-400" /> Attach a link
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              type="button"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 border ${
                menuOpen
                  ? "bg-zinc-700 text-white border-white/20 rotate-45 shadow-inner"
                  : "bg-zinc-800/50 text-zinc-400 border-transparent hover:bg-zinc-700 hover:text-zinc-200"
              }`}
              aria-label="Add attachment"
            >
              <Plus size={20} />
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
            disabled={disabled || (!text.trim() && !file)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-linear-to-tr from-teal-500 to-teal-400 text-white shadow-md transition-all duration-300 hover:shadow-teal-500/25 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none"
            type="button"
            aria-label="Generate"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsoleInput;