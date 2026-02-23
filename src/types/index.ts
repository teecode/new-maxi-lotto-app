export type StatusType = "default" | "success" | "warning" | "danger"

export interface navGroupProps {
  title: string,
  url?: string,
  single: boolean,
  children?: Array<{title: string, url: string}>,
}
