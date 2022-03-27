import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import decos from '../../../../generated/simulator/deco.json'
import skills from '../../../../generated/skills.json'
import { useDecoLimits, useUpdateDecoLimits } from '../../../hooks/decoLimits'
import ConfirmButton from '../../molecules/ConfirmButton'
import NumberField from './NumberField'

const skillMap = new Map(skills.map(v => [v.name, v.details.length] as const))

export default function SimulatorDecos() {
  const [filter, setFilter] = useState('')
  const decoLimits = useDecoLimits()
  const updateDecoLimits = useUpdateDecoLimits()

  const filteredList = useMemo(() => (
    decos.filter(({ name, skills }) =>
      name.includes(filter) || Object.keys(skills).some(v => v.includes(filter))
    )
  ), [filter])

  const setZeroAll = () => {
    const decos = Object.fromEntries(filteredList.map(v => [v.name, 0] as const))

    updateDecoLimits(decos)
  }

  const clearAll = () => {
    const decos = Object.fromEntries(filteredList.map(v => [v.name, undefined] as const))

    updateDecoLimits(decos)
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
          action={setZeroAll}
          dialogTitle="表示をすべてゼロ"
          dialogContent="表示されている装飾品の個数をすべて0にします。よろしいですか？"
          actionText="0にする"
        >
          表示をすべてゼロ
        </ConfirmButton>
        <ConfirmButton
          action={clearAll}
          dialogTitle="表示をすべてクリア"
          dialogContent="表示されている装飾品の個数をすべてクリアします。よろしいですか？"
          actionText="クリアする"
        >
          表示をすべてクリア
        </ConfirmButton>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 1 }} variant="outlined">
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell component="th">装飾品</TableCell>
              <TableCell component="th" align="right">
                <Typography variant="body2" component="span" noWrap>個数</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map((deco) =>
              <TableRow key={deco.name}>
                <TableCell>
                  {deco.name}
                </TableCell>
                <TableCell align="right">
                  <NumberField
                    value={decoLimits[deco.name]}
                    setValue={value => updateDecoLimits({ [deco.name]: value })}
                    min={0}
                    max={skillMap.get(Object.keys(deco.skills)[0])}
                    placeholder={(skillMap.get(Object.keys(deco.skills)[0]) ?? '') + ''}
                  />
                </TableCell>
              </TableRow>
            )}
            {!filteredList.length && (
              <TableRow>
                <TableCell colSpan={2}>
                  装飾品がありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
