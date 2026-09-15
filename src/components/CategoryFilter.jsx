import PropTypes from 'prop-types';

function CategoryFilter({ categories, activeCategory, onChange }) {
  if (categories.length === 0) return null;

  return (
    <div className="category-filter">
      <button
        type="button"
        className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-chip ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CategoryFilter;
