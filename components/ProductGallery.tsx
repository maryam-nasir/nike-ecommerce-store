"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { LuCheck as Check, LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight, LuImageOff as ImageOff } from "react-icons/lu";
import type { Variant } from "@/lib/placeholder-data";

type ProductGalleryProps = {
  title: string;
  variants: Variant[];
};

type SwatchesProps = {
  variants: Variant[];
  value?: string; // color slug
  onChange?: (slug: string) => void;
};

function useValidImages(urls: string[]) {
  return useMemo(() => urls.filter(Boolean), [urls]);
}

const ThumbnailButton = ({
  src,
  alt,
  isActive,
  onClick,
}: {
  src: string | undefined;
  alt: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <button
        type="button"
        aria-label={alt}
        onClick={onClick}
        className={`flex h-16 w-16 items-center justify-center rounded-md border ${
          isActive ? "border-dark-900" : "border-light-300"
        } bg-light-200 text-dark-700`}
      >
        <ImageOff className="h-6 w-6" />
      </button>
    );
  }
  return (
    <button
      type="button"
      aria-label={alt}
      onClick={onClick}
      className={`relative h-16 w-16 overflow-hidden rounded-md border ${
        isActive ? "border-dark-900" : "border-light-300"
      } bg-light-200`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="64px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </button>
  );
};

export default function ProductGallery({ title, variants }: ProductGalleryProps) {
  const variantWithImages = useMemo(() => variants.filter(v => v.images && v.images.length > 0), [variants]);
  const initialVariant = variantWithImages[0] ?? variants[0];
  const [selectedColorSlug, setSelectedColorSlug] = useState<string>(initialVariant?.color.slug);

  const activeVariant = useMemo(() =>
    variantWithImages.find(v => v.color.slug === selectedColorSlug) ?? initialVariant,
  [selectedColorSlug, variantWithImages, initialVariant]);

  const imageUrls = useValidImages((activeVariant?.images ?? []).map(i => i.url));
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainErrored = imageUrls.length === 0;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeVariant]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (imageUrls.length === 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setCurrentIndex((i) => (i + 1) % imageUrls.length);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCurrentIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
    }
  }, [imageUrls.length]);

  return (
    <div className="w-full" ref={containerRef} onKeyDown={handleKeyDown} tabIndex={0} aria-label="Product image gallery">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-light-200">
        {mainErrored ? (
          <div className="flex h-full w-full items-center justify-center text-dark-700">
            <ImageOff className="h-10 w-10" />
          </div>
        ) : (
          <Image
            key={imageUrls[currentIndex]}
            src={imageUrls[currentIndex]}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        )}

        {imageUrls.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between p-2">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setCurrentIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
              className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setCurrentIndex((i) => (i + 1) % imageUrls.length)}
              className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Image thumbnails">
        {imageUrls.length === 0 ? (
          <div className="text-caption text-dark-700">No images available</div>
        ) : (
          imageUrls.map((url, idx) => (
            <ThumbnailButton
              key={url + idx}
              src={url}
              alt={`Thumbnail ${idx + 1}`}
              isActive={idx === currentIndex}
              onClick={() => setCurrentIndex(idx)}
            />
          ))
        )}
      </div>

      <div className="mt-6">
        <Swatches
          variants={variantWithImages}
          value={selectedColorSlug}
          onChange={setSelectedColorSlug}
        />
      </div>
    </div>
  );
}

export function Swatches({ variants, value, onChange }: SwatchesProps) {
  const colors = useMemo(() => {
    const seen = new Set<string>();
    return variants.filter(v => {
      if (!v.images?.[0]?.url) return false;
      if (seen.has(v.color.slug)) return false;
      seen.add(v.color.slug);
      return true;
    });
  }, [variants]);

  if (colors.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Color options">
      {colors.map((v) => {
        const selected = v.color.slug === value;
        return (
          <button
            key={v.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange?.(v.color.slug)}
            className={`relative h-14 w-14 overflow-hidden rounded-md border ${
              selected ? "border-dark-900" : "border-light-300"
            } bg-light-200`}
          >
            <Image src={v.images[0].url} alt={v.color.name} fill sizes="56px" className="object-cover" />
            {selected && (
              <span className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-dark-900">
                <Check className="h-4 w-4" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Attach as namespaced component for ergonomic usage
(ProductGallery as { Swatches?: typeof Swatches }).Swatches = Swatches;

