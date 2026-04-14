import { Dropdown }               from '@/components/ui/Dropdown'
import { MdGridView, MdViewList } from '@/components/ui/Icons'

interface BlogFilterBarProps {
  category: string
  categories: string[]
  gridLabel: string
  listLabel: string
  viewMode: 'grid' | 'list'
  onCategoryChange: (category: string) => void
  onViewModeChange: (viewMode: 'grid' | 'list') => void
}

export function BlogFilterBar({
  category,
  categories,
  gridLabel,
  listLabel,
  viewMode,
  onCategoryChange,
  onViewModeChange,
}: BlogFilterBarProps) {
  return (
    <div className="sticky top-16 z-10" style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="section-inner flex items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={gridLabel}
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            className="p-2 rounded-md"
            style={{ backgroundColor: viewMode === 'grid' ? 'var(--color-ink)' : 'transparent', color: viewMode === 'grid' ? 'var(--color-text-on-dark)' : 'var(--color-text)' }}
          >
            <MdGridView aria-hidden="true" className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={listLabel}
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
            className="p-2 rounded-md"
            style={{ backgroundColor: viewMode === 'list' ? 'var(--color-ink)' : 'transparent', color: viewMode === 'list' ? 'var(--color-text-on-dark)' : 'var(--color-text)' }}
          >
            <MdViewList aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        <Dropdown
          label="Todos"
          options={categories}
          value={category}
          onChange={onCategoryChange}
        />
      </div>
    </div>
  )
}
