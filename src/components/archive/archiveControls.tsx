// /components/archive/ArchiveControls.tsx
type ArchiveControlsProps = {
    searchQuery: string;
    selectedCategory: string;
    categories: string[];
  };
  
  export default function ArchiveControls({ searchQuery, selectedCategory, categories }: ArchiveControlsProps) {
    return (
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          placeholder="Search projects..."
          className="border px-2 py-1"
        />
        <select name="category" defaultValue={selectedCategory} className="border px-2 py-1">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="border px-2 py-1">
          Search
        </button>
      </form>
    );
  }
  