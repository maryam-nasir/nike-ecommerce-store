'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils/query';
import { colors, sizes } from '@/lib/placeholder-data';
import { FaChevronDown, FaFilter } from 'react-icons/fa';

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    gender: true,
    kids: true,
    price: true,
    shoeHeight: true,
    sports: true,
    color: true,
    size: true,
  });

  const handleFilterChange = (type: string, value: string) => {
    const currentValues = searchParams.get(type)?.split(',') ?? [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: type,
      value: newValues.length > 0 ? newValues.join(',') : null,
    });
    router.push(newUrl, { scroll: false });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Gender */}
      <div>
        <button onClick={() => toggleSection('gender')} className="w-full flex justify-between items-center text-lg font-semibold">
          Gender <FaChevronDown className={`transform transition-transform ${openSections.gender ? 'rotate-180' : ''}`} />
        </button>
        {openSections.gender && (
          <div className="mt-2 space-y-2">
            {['men', 'women', 'unisex'].map((gender) => (
              <label key={gender} className="flex items-center space-x-2">
                <input type="checkbox" checked={searchParams.get('gender')?.split(',').includes(gender) ?? false} onChange={() => handleFilterChange('gender', gender)} className="rounded" />
                <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <button onClick={() => toggleSection('price')} className="w-full flex justify-between items-center text-lg font-semibold">
          Shop By Price <FaChevronDown className={`transform transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
        </button>
        {openSections.price && (
          <div className="mt-2 space-y-2">
            {[
              { label: '$0 - $50', value: '0-50' },
              { label: '$50 - $100', value: '50-100' },
              { label: '$100 - $150', value: '100-150' },
              { label: 'Over $150', value: '150' },
            ].map((price) => (
              <label key={price.value} className="flex items-center space-x-2">
                <input type="checkbox" checked={searchParams.get('price')?.split(",").includes(price.value) ?? false} onChange={() => handleFilterChange('price', price.value)} className="rounded" />
                <span>{price.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div>
        <button onClick={() => toggleSection('color')} className="w-full flex justify-between items-center text-lg font-semibold">
          Color <FaChevronDown className={`transform transition-transform ${openSections.color ? 'rotate-180' : ''}`} />
        </button>
        {openSections.color && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button key={color.slug} onClick={() => handleFilterChange('color', color.slug)} className={`w-8 h-8 rounded-full border-2 ${searchParams.get('color')?.split(',').includes(color.slug) ? 'border-blue-500' : 'border-transparent'}`} style={{ backgroundColor: color.hexCode }} title={color.name} />
            ))}
          </div>
        )}
      </div>
      
      {/* Size */}
      <div>
        <button onClick={() => toggleSection('size')} className="w-full flex justify-between items-center text-lg font-semibold">
          Size <FaChevronDown className={`transform transition-transform ${openSections.size ? 'rotate-180' : ''}`} />
        </button>
        {openSections.size && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <label key={size.slug} className={`border rounded-md p-2 text-center cursor-pointer ${searchParams.get('size')?.includes(size.slug) ? 'bg-black text-white' : ''}`}>
                <input type="checkbox" checked={searchParams.get('size')?.split(',').includes(size.slug) ?? false} onChange={() => handleFilterChange('size', size.slug)} className="sr-only" />
                {size.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 p-4">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        {renderFilters()}
      </aside>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        <button onClick={() => setIsDrawerOpen(true)} className="p-2 rounded-md border flex items-center gap-2">
          <FaFilter size={20} />
          <span>Filters</span>
        </button>

        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsDrawerOpen(false)}>
            <div className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white p-6 overflow-y-auto z-50" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setIsDrawerOpen(false)}>&times;</button>
              </div>
              {renderFilters()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Filters;
