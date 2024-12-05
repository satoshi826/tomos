import type { HTMLAttributes } from 'react'

export type ClassName = HTMLAttributes<HTMLElement>['className']
export type CssColor =
	| 'primary'
	| 'secondary'
	| 'neutral'
	| 'accent'
	| 'ghost'
	| 'link'
export type StateColor = 'info' | 'success' | 'warning' | 'error'
