export interface Condition {
  skill: Record<string, number>
  ignore: string[]
  limit?: number
}

export interface Result {
  head: string | undefined;
  body: string | undefined;
  arm: string | undefined;
  wst: string | undefined;
  leg: string | undefined;
  charm: string | undefined;
  deco: [string, number][];
}
