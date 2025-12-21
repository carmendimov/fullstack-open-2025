const Filter = ({ newSearchField, handleSearch }) => {
  return (
    <div>
      filter shown with
      <input value={newSearchField} onChange={handleSearch} />
    </div>
  )
}

export default Filter
