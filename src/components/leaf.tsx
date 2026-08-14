export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 30C30 8 78 4 116 6c-6 26-40 44-70 44-14 0-30-6-40-20Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M14 30C40 20 82 14 112 10"
        stroke="#f7f1e8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function LeafSpray({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Leaf className="absolute -top-2 left-0 w-24 text-[#e8622a] rotate-[15deg] animate-float [--r:15deg]" />
      <Leaf className="absolute top-8 left-10 w-16 text-[#f59331] rotate-[-20deg] animate-float [--r:-20deg]" />
      <Leaf className="absolute top-16 left-2 w-20 text-[#e8622a]/70 rotate-[40deg] animate-float [--r:40deg]" />
    </div>
  );
}
