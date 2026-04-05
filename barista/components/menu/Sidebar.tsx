'use client';

import { Category } from '@/lib/api';

interface SidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export default function Sidebar({ categories, activeCategory, onCategorySelect }: SidebarProps) {
  return (
    <>
      {/* Mobile/Tablet Horizontal Scroll Sidebar */}
      <div className="md:hidden w-full bg-white border-b border-[#E8E3D9]">
        <div className="flex overflow-x-auto scrollbar-hide gap-2 px-4 py-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all text-sm min-h-[44px] ${
                activeCategory === category.id
                  ? 'bg-[#8B6F47] text-white'
                  : 'bg-[#F2EFE9] text-[#1A1A1A] hover:bg-[#E8E3D9]'
              }`}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={activeCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-[#F9F7F4] border-r border-[#E8E3D9] h-screen overflow-y-auto">
        <nav className="p-6 space-y-2">
          <h2 className="text-xs font-semibold text-[#8E8680] uppercase tracking-wider mb-4">
            Categories
          </h2>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all min-h-[44px] ${
                activeCategory === category.id
                  ? 'bg-[#8B6F47] text-white shadow-sm'
                  : 'text-[#1A1A1A] hover:bg-[#E8E3D9]'
              }`}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={activeCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </aside>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
