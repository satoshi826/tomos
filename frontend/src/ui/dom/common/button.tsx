import type { ClassName, CssColor, StateColor } from '@/util/type'

type Props = {
	onClick: () => void
	className?: ClassName
	outline?: boolean
	disabled?: boolean
	color?: CssColor | StateColor
	style?: React.CSSProperties
}

export function Button({ children, className = '', onClick, color, outline, disabled, style }: React.PropsWithChildren<Props>) {
	const _className: ClassName = `btn${outline ? ' btn-outline' : ''}${disabled ? ' btn-disabled' : ''}${color ? ` btn-${color}` : ''} ${className}`
	return (
		<button type="button" className={_className} onClick={onClick} disabled={disabled} style={style}>
			{children}
		</button>
	)
}
