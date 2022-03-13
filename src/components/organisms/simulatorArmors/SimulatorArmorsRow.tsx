import { Checkbox, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'

interface Props {
  name: string
  equips: ({ name: string, isIgnore: boolean, toggleIgnore: () => void } | null)[]
}

export default function SimulatorArmorsRow({ name, equips }: Props) {
  const [head, body, arm, wst, leg] = equips

  const nonNullableEquips = equips.filter(<T,>(v: T): v is NonNullable<T> => v as any)
  const [{ isIgnore }, ...restEequips] = nonNullableEquips
  const indeterminate = restEequips.some(v => v.isIgnore !== isIgnore)

  const onChange = () => {
    const list = !indeterminate && !isIgnore
      ? nonNullableEquips.filter(v => !v.isIgnore)
      : nonNullableEquips.filter(v => v.isIgnore)

    list.forEach(v => v.toggleIgnore())
  }

  return (
    <TableRow >
      <TableCell padding="checkbox">
        <Checkbox
          checked={!indeterminate && !isIgnore}
          indeterminate={indeterminate}
          onChange={onChange}
        />
      </TableCell>
      <TableCell>
        <Typography component="span" variant="body2">{name}</Typography>
      </TableCell>
      <TableCell padding="checkbox">
        {head && (
          <Checkbox checked={!head.isIgnore} onChange={head.toggleIgnore} />
        )}
      </TableCell>
      <TableCell padding="checkbox">
        {body && (
          <Checkbox checked={!body.isIgnore} onChange={body.toggleIgnore} />
        )}
      </TableCell>
      <TableCell padding="checkbox">
        {arm && (
          <Checkbox checked={!arm.isIgnore} onChange={arm.toggleIgnore} />
        )}
      </TableCell>
      <TableCell padding="checkbox">
        {wst && (
          <Checkbox checked={!wst.isIgnore} onChange={wst.toggleIgnore} />
        )}
      </TableCell>
      <TableCell padding="checkbox">
        {leg && (
          <Checkbox checked={!leg.isIgnore} onChange={leg.toggleIgnore} />
        )}
      </TableCell>
    </TableRow>
  )
}
