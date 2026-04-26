/** Soft botanical accents (SVG, watercolor-style washes). */
export function WatercolorLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-garden" aria-hidden>
      <svg
        className="absolute -right-8 -top-6 h-40 w-40 opacity-[0.18] text-garden-sage-500"
        viewBox="0 0 120 120"
        fill="none"
      >
        <defs>
          <linearGradient id="leafA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M78 8C52 22 28 48 20 78c-4 14-2 28 6 38 10-18 28-32 52-40 20-8 38-8 42 2-8-28-20-52-32-70z"
          fill="url(#leafA)"
        />
        <path
          d="M95 45c-22 6-40 22-48 44 16-8 34-10 52-6-2-14-2-28-4-38z"
          fill="currentColor"
          opacity="0.25"
        />
      </svg>
      <svg
        className="absolute -bottom-4 -left-6 h-36 w-36 rotate-[15deg] opacity-[0.14] text-garden-clay-500"
        viewBox="0 0 120 120"
        fill="none"
      >
        <path
          d="M12 88c28-8 52-28 64-56-18 12-40 20-64 24v32z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M8 70c24-4 48-16 62-38C54 48 32 62 8 70z"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}
