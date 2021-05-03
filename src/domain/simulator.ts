export interface Condition {
  skills: Record<string, number>
  ignore: string[]
  objectiveSkill?: string
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
