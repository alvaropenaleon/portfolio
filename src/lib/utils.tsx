/**
 * highlightText
 * Splits a piece of text by the query (case-insensitive) and wraps matches with <mark>.
 * @param text The text to be displayed and possibly highlighted
 * @param query The user's search string to highlight
 * @param customStyle Optional inline styles to apply to the <mark> element
 * @returns An array of React nodes with <mark> around matched substrings
 */
export function highlightText(
    text: string,
    query: string,
    customStyle?: React.CSSProperties
) {
    if (!query) return text;

    // Escape special regex chars in the query
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create a case-insensitive regex that captures the query
    const regex = new RegExp(`(${escaped})`, 'gi');

    return text.split(regex).map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <mark
                key={i}
                style={customStyle || { backgroundColor: 'transparent', color: '#007AFF' }}
            >
                {part}
            </mark>
        ) : (
            part
        )
    );
}
