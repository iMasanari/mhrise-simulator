import { css } from '@emotion/react'
import { Add, Remove } from '@mui/icons-material'
import { IconButton, InputAdornment, Select, SelectChangeEvent, TextField, TextFieldProps } from '@mui/material'
import { ChangeEvent } from 'react'

type Props = TextFieldProps & {
  value: number | null | undefined
  setValue: (value: number | undefined) => void
  min: number
  max?: number | undefined
}

const inputStyle = css`
  & input {
    -moz-appearance: textfield;
  }
  & input::-webkit-inner-spin-button,
  & input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export default function NumberField({ value, setValue, min, max, ...props }: Props) {
  const subActionHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value !== '' ? +e.target.value : undefined)

  return (
    <TextField
      type="number"
      css={inputStyle}
      variant="outlined"
      value={value ?? ''}
      onChange={subActionHandler}
      size="small"
      inputProps={{
        sx: { textAlign: 'right' },
        inputMode: 'numeric',
        pattern: '[0-9]*',
        min,
        max,
        // ...inputProps,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton edge="start" onClick={() => setValue(Math.max(+(value ?? props.placeholder ?? 0) - 1, 0))}>
              <Remove />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={() => setValue(Math.min(+(value ?? props.placeholder ?? 0) + 1, max != null ? max : Infinity))}>
              <Add />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
}
