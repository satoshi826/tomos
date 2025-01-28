import type { HTMLAttributes } from 'react'

export type ClassName = HTMLAttributes<HTMLElement>['className']
export type CssColor = 'primary' | 'secondary' | 'neutral' | 'accent' | 'ghost' | 'link'
export type StateColor = 'info' | 'success' | 'warning' | 'error'

type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[]

export type JSONCompatible<T> = {
  [K in keyof T]: T[K] extends Date
    ? string // Date型をstringに変換
    : T[K] extends object
      ? JSONCompatible<T[K]> // ネストされたオブジェクトを再帰的に処理
      : T[K] extends JSONValue
        ? T[K] // JSONで表現可能な型はそのまま
        : never // JSONで表現できない型はneverに
}
