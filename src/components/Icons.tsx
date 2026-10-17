// Simple icons drawn for this project at the sizes the layout expects.

export function Sparkle({ color = "rgb(2, 129, 224)" }: { color?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M9 2c.5 3.4 2.6 5.5 6 6-3.4.5-5.5 2.6-6 6-.5-3.4-2.6-5.5-6-6 3.4-.5 5.5-2.6 6-6Z"
        fill={color}
      />
    </svg>
  );
}

export function Arrow({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Lock({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <rect x="4" y="8" width="10" height="7.5" rx="2" fill={color} />
      <path d="M6.2 8V6.2a2.8 2.8 0 0 1 5.6 0V8" fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function Store({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M5 3.2v11.6c0 .5.5.8.9.5l9.2-5.8a.6.6 0 0 0 0-1L5.9 2.7c-.4-.3-.9 0-.9.5Z" fill={color} />
    </svg>
  );
}

export function Pin({ color = "#000" }: { color?: string }) {
  return (
    <svg viewBox="0 0 11.2 16" aria-hidden="true">
      <path
        d="M5.6 0A5.6 5.6 0 0 0 0 5.6C0 9.8 5.6 16 5.6 16s5.6-6.2 5.6-10.4A5.6 5.6 0 0 0 5.6 0Zm0 7.8a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z"
        fill={color}
      />
    </svg>
  );
}

export function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 9h3v11h-3V9Zm1.5-5a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 6 4Zm4 5h2.9v1.6c.5-.9 1.7-1.9 3.5-1.9 3.1 0 3.6 2 3.6 4.7V20h-3v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H10V9Z" fill="#000" />
    </svg>
  );
}

export function Behance() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 6h6c2.2 0 3.5 1.1 3.5 2.9 0 1.1-.6 1.9-1.5 2.3 1.3.4 2 1.4 2 2.7 0 2.1-1.6 3.4-4 3.4H2V6Zm3 2.3v2.5h2.6c.8 0 1.3-.5 1.3-1.3s-.5-1.2-1.3-1.2H5Zm0 4.6v2.8h2.9c.9 0 1.5-.5 1.5-1.4s-.6-1.4-1.5-1.4H5Zm13.2-3.6c2.6 0 4.1 1.8 4 4.7h-6c.1 1.2.9 1.9 2 1.9.8 0 1.4-.4 1.7-1h2.2c-.5 1.8-2 2.8-3.9 2.8-2.6 0-4.3-1.7-4.3-4.2 0-2.5 1.7-4.2 4.3-4.2Zm-1.9 3.3h3.7c-.1-1-.8-1.6-1.8-1.6s-1.7.6-1.9 1.6ZM15 6.5h5v1.3h-5V6.5Z"
        fill="#000"
      />
    </svg>
  );
}

// a simple wire paperclip, drawn as a rounded loop
export function Paperclip() {
  return (
    <svg viewBox="0 0 50 150" width="50" height="150" aria-hidden="true">
      <defs>
        <linearGradient id="clip-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9aa3ab" />
          <stop offset="0.5" stopColor="#e9edf0" />
          <stop offset="1" stopColor="#8a939b" />
        </linearGradient>
      </defs>
      <path
        d="M17 120V22a8 8 0 0 1 16 0v86a14 14 0 0 1-28 0V30"
        fill="none"
        stroke="url(#clip-metal)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M17 120V22a8 8 0 0 1 16 0v86" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" transform="translate(1.2 1.6)" />
    </svg>
  );
}

export function Download({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M9 2.5v8.5M5.2 7.6 9 11.4l3.8-3.8M3.5 14.5h11" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron({ color = "#000" }: { color?: string }) {
  return (
    <svg viewBox="0 0 6 12" aria-hidden="true">
      <path d="M5 1 1 6l4 5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
