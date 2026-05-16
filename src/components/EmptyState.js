export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center px-6 py-12">
      {icon && (
        <div className="opacity-40">
          {icon}
        </div>
      )}
      <div className="text-xl font-bold text-[var(--color-text-primary)]">
        {title}
      </div>
      {description && (
        <div className="text-sm text-[var(--color-text-secondary)] max-w-md">
          {description}
        </div>
      )}
      {action}
    </div>
  );
}