export function IconButton({ children, onClick }: { children: string; onClick?: (c: string) => void }) {
  return (
    <span
      {...(onClick ? { onClick: () => onClick(children) } : {})}
      className="btn btn-circle material-symbols-rounded !text-3xl border-0 bg-transparent"
    >
      {children}
    </span>
  )
}
