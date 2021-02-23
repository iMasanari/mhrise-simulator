import { css } from '@emotion/react'

interface Props {
  value: number | undefined
  items: number[]
  update: (value: number | undefined) => void
}

const skillLevelStyle = css`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`

const itemStyle = css`
  width: 12px;
  height: 12px;
  border: 1px solid #bbb;
  margin: 0 2px 0 0;
  padding: 0;
  background: #fff;
  text-align: center;
  cursor: pointer;
`

const itemActiveStyle = css`
  background: #bbb;
`

export default function SkillLevel({ value, items, update }: Props) {
  return (
    <ul css={skillLevelStyle}>
      {items.map((level) =>
        <li
          key={level}
          css={[itemStyle, value === level && itemActiveStyle]}
          onClick={(e) => {
            // TODO: イベント伝搬無効処理の方法を検討する
            e.stopPropagation()
            update(value === level ? 0 : level)
          }}
        />
      )}
    </ul>
  )
}
