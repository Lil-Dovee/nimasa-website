export default function Logo({ size = 40 }) {
  return (
    <div
      className="flex items-center justify-center rounded-md bg-white"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size * 0.75}
        height={size * 0.75}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="18" stroke="#0E7C8A" strokeWidth="2" />
        <path
          d="M20 8 L20 32 M14 14 L26 14 M12 22 L28 22 M16 28 L24 28"
          stroke="#0E7C8A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="20"
          y="38"
          textAnchor="middle"
          fontSize="5"
          fontWeight="700"
          fill="#0E7C8A"
        >
          NIMASA
        </text>
      </svg>
    </div>
  );
}