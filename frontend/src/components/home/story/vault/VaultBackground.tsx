'use client';

export default function VaultBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="nw-vault-bg absolute inset-0" />
      <div className="nw-vault-bg-grid absolute inset-0" />
      <div className="nw-vault-bg-noise absolute inset-0" />
      <div className="nw-vault-bg-vignette absolute inset-0" />
    </div>
  );
}
