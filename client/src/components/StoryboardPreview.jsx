const parseJson = (raw) => {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : cleaned);
  } catch {
    return null;
  }
};

const StoryboardPreview = ({ rawContent }) => {
  const data = parseJson(rawContent);

  if (!data) {
    return <p className="text-sm text-zinc-500">Could not parse video package content.</p>;
  }

  return (
    <div className="space-y-6">
      {data.script && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Script</h4>
          <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">{data.script}</p>
        </div>
      )}

      {data.storyboard?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Storyboard</h4>
          <div className="space-y-2">
            {data.storyboard.map((scene, i) => (
              <div key={i} className="flex gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5">
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {scene.scene || i + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-600"><b className="text-zinc-800">Visual:</b> {scene.visual}</p>
                  <p className="text-xs text-zinc-600"><b className="text-zinc-800">Narration:</b> {scene.narration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.subtitles?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Subtitles</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">{data.subtitles.join(" / ")}</p>
        </div>
      )}

      {data.visualRecommendations && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Visual Direction</h4>
          <p className="text-sm text-zinc-700 leading-relaxed">{data.visualRecommendations}</p>
        </div>
      )}
    </div>
  );
};

export default StoryboardPreview;