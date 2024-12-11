export function IconButton({ children, onClick }: { children: string; onClick?: (c: string) => void }) {
  return (
    <span
      {...(onClick ? { onClick: () => onClick(children) } : {})}
      className="btn btn-circle material-symbols-rounded border-opacity-0 bg-transparent text-3xl"
    >
      {children}
    </span>
  )
}
