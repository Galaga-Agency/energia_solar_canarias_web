interface AnimatedBirdFlockProps {
  className?: string
}

export function AnimatedBirdFlock({ className = '' }: AnimatedBirdFlockProps) {
  return (
    <div
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      data-bird-flock
      aria-hidden="true"
    >
      <canvas
        className="block h-full w-full"
        data-bird-flock-canvas
      />
    </div>
  )
}
