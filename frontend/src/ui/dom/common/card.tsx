export function Card({ children, className = '', style }: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  // rounded-2xl bg-zinc-900 p-4
  return (
    <div className={`card bg-base-200A p-4 ring ring-divider ${className}`} style={style}>
      {children}
    </div>
  )
}
