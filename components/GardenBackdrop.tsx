/**
 * Soft teal/sky washes behind content (pointer-events none).
 */
export function GardenBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-garden-clay-200/40 blur-3xl" />
      <div className="absolute -right-32 top-0 h-[22rem] w-[22rem] rounded-[55%_45%_50%_50%] bg-garden-sage-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-96 rounded-[45%_55%_60%_40%] bg-care-glow/10 blur-3xl" />
      <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-white/30 blur-2xl" />
    </div>
  )
}
