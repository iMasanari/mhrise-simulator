import { IconButton, InputAdornment, Select } from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

interface Props {
  value: number
  items: number[]
  setValue: (value: number) => void
}

const useStyles = makeStyles({
  icon: {
    display: 'none',
  },
  select: {
    '&&&': { paddingRight: 0 },
  },
})

export default function SkillLevelSelect({ value, items, setValue }: Props) {
  const classes = useStyles()

  const subActionHandler = (e: React.ChangeEvent<{ value: string | number }>) =>
    setValue(+e.currentTarget.value)

  return (
    <Select
      variant="outlined"
      value={value || 0}
      native
      onChange={subActionHandler}
      size="small"
      classes={{ icon: classes.icon, select: classes.select }}
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
