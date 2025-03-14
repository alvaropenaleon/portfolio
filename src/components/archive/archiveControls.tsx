// /components/archive/ArchiveControls.tsx
type ArchiveControlsProps = {
    searchQuery: string;
    selectedCategory: string;
  };
  
  export default function ArchiveControls({ searchQuery, selectedCategory }: ArchiveControlsProps) {
    return (
      <form method="get">
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          placeholder="Search projects..."
        />
        <select
          name="category"
          defaultValue={selectedCategory}
        >
          <option value="">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
          {/* Add more options as needed */}
        </select>
        <button type="submit">
          Search
        </button>
      </form>
    );
  }
  