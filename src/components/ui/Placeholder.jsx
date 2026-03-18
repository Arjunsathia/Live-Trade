export function Placeholder({ name }) {
  return (
    <div className="flex-1 flex items-center justify-center h-full text-text-muted">
      <div className="text-center">
        <h2 className="text-heading text-text mb-2">{name}</h2>
        <p>This module is under construction.</p>
      </div>
    </div>
  );
}
