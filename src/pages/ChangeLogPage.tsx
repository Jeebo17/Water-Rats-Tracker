import changelog from "../data/changelog.json";

export function ChangeLogPage() {
    return (
        <div className="mt-3 mb-3 px-4 sm:px-8 md:px-[15%] lg:px-[25%] pt-5">
        <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl mb-4">
            Change Log
        </h1>

        {changelog.map((entry) => (
            <div key={entry.version} className="pb-8">
            <p className="mb-3 font-semibold text-2xl whitespace-pre-line">
                v{entry.version} - {entry.date}
            </p>

            <ul>
                {entry.new && entry.new.length > 0 && (
                <li className="font-semibold text-lg mt-4">
                    ✨ New
                    <ul className="ml-4 text-base font-normal p-1 list-disc pl-4">
                    {entry.new.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                    </ul>
                </li>
                )}

                {entry.changed && entry.changed.length > 0 && (
                <li className="font-semibold text-lg mt-4">
                    🔧 Changed
                    <ul className="ml-4 text-base font-normal p-1 list-disc pl-4">
                    {entry.changed.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                    </ul>
                </li>
                )}

                {entry.fixed && entry.fixed.length > 0 && (
                <li className="font-semibold text-lg mt-4">
                    🐛 Fixed
                    <ul className="ml-4 text-base font-normal p-1 list-disc pl-4">
                    {entry.fixed.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                    </ul>
                </li>
                )}
            </ul>
            </div>
        ))}
        </div>
    );
}

export default ChangeLogPage;
