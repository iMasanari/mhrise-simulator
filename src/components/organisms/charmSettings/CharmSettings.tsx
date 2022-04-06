import { Box, Button, Checkbox, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toCharms, toCsv } from '../../../csv/charms'
import { Charm } from '../../../domain/equips'
import { useAddCharm, useCharms, useRemoveCharms, useReplaceCharm } from '../../../hooks/charmsHooks'
import RegisterCharmDialog from '../registerCharmDialog/RegisterCharmDialog'

interface Props {
  skills: { name: string, items: number[] }[]
}

export default function CharmSettings({ skills }: Props) {
  const [open, setOpen] = useState(false)
  const charms = useCharms()
  const addCharm = useAddCharm()
  const replaceCharm = useReplaceCharm()
  const removeCharms = useRemoveCharms()
  const [selected, setSelected] = useState({} as Record<number, boolean>)
  const [csvDelimiter, setCsvDelimiter] = useState(',')
  const [csvText, setCsvText] = useState('')

  const selectedList = Object.keys(selected).map(Number).filter(v => selected[v])

  const onClose = (charm?: Charm) => {
    setOpen(false)

    if (charm) {
      addCharm(charm)
      setSelected({})
    }
  }

  const remove = () => {
    removeCharms(selectedList)
    setSelected({})
  }

  return (
    <div>
      <Box m={1}>
        <Button variant="outlined" onClick={() => setOpen(true)}>護石追加</Button>
        {selectedList.length > 0 && (
          <Button variant="outlined" onClick={remove} sx={{ ml: 1 }}>選択の護石を削除</Button>
        )}
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell colSpan={2}>
                <Typography variant="inherit" noWrap>スキル1</Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="inherit" noWrap>スキル2</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="inherit" noWrap>スロット</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {charms.map((charm, i) =>
              <TableRow key={i} hover selected={selected[i]}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected[i] || false}
                    onClick={() => setSelected(selected => ({ ...selected, [i]: !selected[i] }))}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="inherit" noWrap>{Object.keys(charm.skills)[0]}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="inherit" noWrap>{Object.values(charm.skills)[0]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="inherit" noWrap>{Object.keys(charm.skills)[1]}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="inherit" noWrap>{Object.values(charm.skills)[1]}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="inherit" noWrap>{charm.slots.map(v => `【${v}】`).join('')}</Typography>
                </TableCell>
              </TableRow>
            )}
            {!charms.length && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="inherit" noWrap>護石が登録されていません</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>護石インポート/エクスポート</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Select size="small" value={csvDelimiter} onChange={e => setCsvDelimiter(e.target.value)} native>
            <option value=",">コンマ区切り</option>
            <option value={'\t'}>タブ区切り</option>
          </Select>
          <Button variant={csvText === '' ? 'contained' : 'outlined'} onClick={() => setCsvText(toCsv(charms, csvDelimiter))}>
            エクスポート
          </Button>
        </Box>
        <TextField
          multiline
          rows={4}
          size="small"
          fullWidth
          sx={{ my: 1 }}
          value={csvText}
          onChange={e => setCsvText(e.currentTarget.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" disabled={csvText === ''} onClick={() => replaceCharm(toCharms(csvText))}>
            インポート
          </Button>
        </Box>
      </Box>
      {open && (
        <RegisterCharmDialog
          open={open}
          onClose={onClose}
          skills={skills}
        />
      )}
    </div>
  )
}
