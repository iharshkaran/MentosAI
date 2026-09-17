import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const parseJson = (raw) => {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : cleaned);
  } catch {
    return null;
  }
};

const SlidePreview = ({ rawContent }) => {
  const data = parseJson(rawContent);
  const [index, setIndex] = useState(0);

  if (!data?.slides?.length) {
    return <p className="text-sm text-zinc-500">Could not parse presentation content.</p>;
  }

  const slide = data.slides[index];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center text-white min-h-[300px]">
        <h3 className="text-2xl font-bold mb-5 leading-snug">{slide.title}</h3>
        <ul className="space-y-2.5 list-disc list-inside text-white/85">
          {(slide.bullets || []).map((b, i) => (
            <li key={i} className="text-sm leading-relaxed">{b}</li>
          ))}
        </ul>
      </div>

      {slide.speakerNotes && (
        <div className="mt-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-xs text-zinc-600">
          <span className="font-semibold text-zinc-500">Speaker notes: </span>
          {slide.speakerNotes}
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="p-2 rounded-lg border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs text-zinc-500 font-medium">
          Slide {index + 1} of {data.slides.length}
        </span>
        <button
          onClick={() => setIndex((i) => Math.min(data.slides.length - 1, i + 1))}
          disabled={index === data.slides.length - 1}
          className="p-2 rounded-lg border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SlidePreview;