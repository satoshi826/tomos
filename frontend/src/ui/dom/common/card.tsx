export function Card({ children, className = '', style }: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <div className={`card bg-zinc-900 p-4 rounded-2xl ${className}`} style={style}>
      {children}
    </div>
  )
}
