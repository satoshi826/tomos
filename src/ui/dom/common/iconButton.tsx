
export function IconButton({children, onClick}: {children: string, onClick?: (c: string) => void}) {
  return (
    <span
      {...onClick ? {onClick: () => onClick(children)} : {}}
      className="btn btn-circle material-symbols-rounded text-3xl bg-transparent border-opacity-0">
      {children}
    </span>
  )
}