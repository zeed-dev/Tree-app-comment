import { useMemo, useState } from 'react'
import './App.css'

const pages = ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6']

export default function App() {
  const [selectedStates, setSelectedStates] = useState(() => pages.map(() => false))
  const allChecked = useMemo(() => selectedStates.every(Boolean), [selectedStates])

  const toggleAll = () => {
    const next = !allChecked
    setSelectedStates(selectedStates.map(() => next))
  }

  const togglePage = (index: number) => {
    setSelectedStates((prev) => prev.map((value, idx) => (idx === index ? !value : value)))
  }

  const handleDone = () => {
    const selectedPages = pages.filter((_, index) => selectedStates[index])
    if (selectedPages.length === 0) {
      window.alert('No pages selected')
      return
    }

    window.alert(`Selected pages: ${selectedPages.join(', ')}`)
  }

  return (
    <main id="app">
      <div className="card">
        <div className="list-item header-item">
          <label htmlFor="all-pages">All pages</label>
          <div className="checkbox-wrapper">
            <input
              id="all-pages"
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
            />
            <span className="custom-checkbox" aria-hidden="true" />
          </div>
        </div>

        <div className="divider" aria-hidden="true" />

        <div className="scrollable-list">
          {pages.map((label, index) => (
            <div className="list-item" key={label}>
              <label htmlFor={`page-${index + 1}`}>{label}</label>
              <div className="checkbox-wrapper">
                <input
                  id={`page-${index + 1}`}
                  className="page-checkbox"
                  type="checkbox"
                  checked={selectedStates[index]}
                  onChange={() => togglePage(index)}
                  aria-label={label}
                />
                <span className="custom-checkbox" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        <div className="divider" aria-hidden="true" />

        <button className="btn-done" type="button" onClick={handleDone}>
          Done
        </button>
      </div>
    </main>
  )
}
