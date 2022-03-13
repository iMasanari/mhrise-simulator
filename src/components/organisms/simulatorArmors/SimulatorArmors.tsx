import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import series from '../../../../generated/details/series.json'
import { useIgnoreArmors, useToggleIgnoreArmors, useUpdateIgnoreArmors } from '../../../hooks/armorSettingsHooks'
import ConfirmButton from '../../molecules/ConfirmButton'
import SimulatorArmorsRow from './SimulatorArmorsRow'

export default function SimulatorArmors() {
  const [filter, setFilter] = useState('')
  const ignore = useIgnoreArmors()
  const toggleIgnoreArmors = useToggleIgnoreArmors()
  const updateIgnoreArmors = useUpdateIgnoreArmors()

  const filteredSeries = useMemo(() => (
    series
      .map(({ name, equips }) => [name, equips.map(name => !name || name.includes(filter) ? name : null)] as const)
      .filter(([, equips]) => equips.some(Boolean))
  ), [filter])

  const toEquipCellData = (name: string) => ({
    name,
    isIgnore: ignore[name] || false,
    toggleIgnore: () => toggleIgnoreArmors(name),
  })

  const checkAll = () => {
    const list = filteredSeries.flatMap(([, equips]) =>
      equips.filter(<T,>(v: T): v is NonNullable<T> => v as any)
    )
    updateIgnoreArmors(Object.fromEntries(list.map(v => [v, true] as const)))
  }

  const ignoreAll = () => {
    const list = filteredSeries.flatMap(([, equips]) =>
      equips.filter(<T,>(v: T): v is NonNullable<T> => v as any)
    )
    updateIgnoreArmors(Object.fromEntries(list.map(v => [v, false] as const)))
  }

  return (
    <div>
      <TextField
        size="small"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="フィルター"
        fullWidth
        sx={{ mt: 1 }}
      />
      <Box mt={1} textAlign="right">
        <ConfirmButton
          action={checkAll}
          dialogTitle="表示をすべて除外"
          dialogContent="表示されている防具をすべて除外します。よろしいですか？"
          actionText="除外する"
        >
          表示をすべて除外
        </ConfirmButton>
        <ConfirmButton
          action={ignoreAll}
          dialogTitle="表示をすべてチェック"
          dialogContent="表示されている防具をすべてチェックします。よろしいですか？"
          actionText="チェックする"
        >
          表示をすべてチェック
        </ConfirmButton>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 1 }} variant="outlined">
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell component="th" padding="checkbox" />
              <TableCell component="th">シリーズ</TableCell>
              <TableCell component="th" align="center" padding="checkbox">
                <Typography variant="body2" component="span" noWrap>頭</Typography>
              </TableCell>
              <TableCell component="th" align="center" padding="checkbox">
                <Typography variant="body2" component="span" noWrap>胴</Typography>
              </TableCell>
              <TableCell component="th" align="center" padding="checkbox">
                <Typography variant="body2" component="span" noWrap>腕</Typography>
              </TableCell>
              <TableCell component="th" align="center" padding="checkbox">
                <Typography variant="body2" component="span" noWrap>腰</Typography>
              </TableCell>
              <TableCell component="th" align="center" padding="checkbox">
                <Typography variant="body2" component="span" noWrap>足</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSeries.map(([name, equips]) =>
              <SimulatorArmorsRow
                key={name}
                name={name}
                equips={equips.map(v => v ? toEquipCellData(v) : null)}
              />
            )}
            {!filteredSeries.length && (
              <TableRow >
                <TableCell colSpan={7}>
                  防具がありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
