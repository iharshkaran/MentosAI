const ConfigPanel = ({ config, setConfig }) => {
    const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

    return (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-xs text-gray-500">Tone</label>
                <select
                    value={config.tone}
                    onChange={(e) => update("tone", e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm mt-1"
                >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="urgent">Urgent</option>
                    <option value="formal">Formal</option>
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-500">Audience</label>
                <input
                    type="text"
                    value={config.audience}
                    onChange={(e) => update("audience", e.target.value)}
                    placeholder="e.g. executives"
                    className="w-full border rounded-lg p-2 text-sm mt-1"
                />
            </div>

            <div>
                <label className="text-xs text-gray-500">Detail level</label>
                <select
                    value={config.detailLevel}
                    onChange={(e) => update("detailLevel", e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm mt-1"
                >
                    <option value="brief">Brief</option>
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-500">Language</label>
                <input
                    type="text"
                    value={config.language}
                    onChange={(e) => update("language", e.target.value)}
                    placeholder="e.g. en"
                    className="w-full border rounded-lg p-2 text-sm mt-1"
                />
            </div>
        </div>
    );
};

export default ConfigPanel;