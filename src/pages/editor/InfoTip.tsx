interface InfoTipProps {
  text: string;
}

export function InfoTip({ text }: InfoTipProps) {
  return (
    <button
      type="button"
      title={text}
      className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-surface/70 text-white/70 shadow-soft hover:bg-surface hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-surface transition-colors cursor-help"
      aria-label={text}
      onClick={(e) => {
        // Informational button - tooltip shown by browser via title attribute
        // Prevent any default action to make the intent clear
        e.preventDefault();
      }}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"
        />
      </svg>
    </button>
  );
}
