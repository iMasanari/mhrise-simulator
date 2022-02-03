import { css } from '@emotion/react'
import { Add, Remove } from '@mui/icons-material'
import { IconButton, InputAdornment, Select, SelectChangeEvent } from '@mui/material'

interface Props {
  value: number
  items: number[]
  setValue: (value: number) => void
}

const selectStyle = css`
  & .SkillLevelSelect-icon {
    display: none;
  }
  &&& .SkillLevelSelect-select {
    padding-right: 0;
  }
`

export default function SkillLevelSelect({ value, items, setValue }: Props) {
  const subActionHandler = (e: SelectChangeEvent<number>) =>
    setValue(+e.target.value)

  return (
    <Select
      css={selectStyle}
      variant="outlined"
      value={value || 0}
      native
      onChange={subActionHandler}
      size="small"
      classes={{ icon: 'SkillLevelSelect-icon', select: 'SkillLevelSelect-select' }}
      startAdornment={(
        <InputAdornment position="start">
          <IconButton edge="start" onClick={() => setValue(Math.max(value - 1, 0))}>
            <Remove />
          </IconButton>
        </InputAdornment>
      )}
      endAdornment={(
        <InputAdornment position="end">
          <IconButton edge="end" onClick={() => setValue(Math.min(value + 1, items.length))}>
            <Add />
          </IconButton>
        </InputAdornment>
      )}
    >
      <option value={0} />
      {items.map(level =>
        <option key={level} value={level}>{`LV ${level}`}</option>
      )}
    </Select>
  )
}
