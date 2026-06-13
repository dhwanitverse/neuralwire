/**
 * Global ambient background for NeuralWire.
 * Pure-CSS, GPU-friendly layers: base gradient, drifting aurora,
 * animated neural mesh grid, a sparse particle field and a vignette.
 * Fixed behind all content (-z-10) and non-interactive.
 */
export default function NeuralAtmosphere() {
  return (
    <div className="nw-atmosphere" aria-hidden>
      <div className="nw-atmo-base" />
      <div className="nw-atmo-aurora nw-atmo-aurora-1" />
      <div className="nw-atmo-aurora nw-atmo-aurora-2" />
      <div className="nw-atmo-aurora nw-atmo-aurora-3" />
      <div className="nw-atmo-mesh" />
      <div className="nw-atmo-particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} style={{ ['--i' as string]: i }} />
        ))}
      </div>
      <div className="nw-atmo-vignette" />
    </div>
  );
}
