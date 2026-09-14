const OUTPUT_OPTIONS = [
    { value: "linkedin", label: "LinkedIn Post" },
    { value: "twitter", label: "X (Twitter) Thread" },
    { value: "advisory", label: "Advisory / Notice" },
    { value: "execSummary", label: "Executive Summary" },
    { value: "presentation", label: "Presentation" },
    { value: "infographic", label: "Infographic" },
    { value: "videoPackage", label: "Video Package" },
];

const OutputSelector = ({ selected, setSelected }) => {
    const toggle = (value) => {
        setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    return (
        <div>
            <label className="text-sm font-medium text-gray-700">Output formats</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {OUTPUT_OPTIONS.map((opt) => (
                    <label
                        key={opt.value}
                        className={`flex items-center gap-2 border rounded-lg p-2 text-sm cursor-pointer transition ${selected.includes(opt.value) ? "border-blue-500 bg-blue-50" : "border-gray-200"
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(opt.value)}
                            onChange={() => toggle(opt.value)}
                            className="accent-blue-500"
                        />
                        {opt.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default OutputSelector;