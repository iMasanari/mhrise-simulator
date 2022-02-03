import { Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useSetResultOpen, useSimulatorPageState } from '../../../hooks/simualtorPageState'
import { useSimulator } from '../../../hooks/simulatorHooks'
import SimulatorResultRow from './SimulatorResultRow'

export default function SimulatorResult() {
  const { result, loading, completed, more } = useSimulator()
  const { opens } = useSimulatorPageState()
  const setResultOpen = useSetResultOpen()

  return (
    <div>
      {(result.length > 0 || loading) && (
        <TableContainer component={Paper} sx={{ my: 1 }} variant="outlined">
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell component="th" sx={{ px: 0.5, width: 42 }}></TableCell>
                <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                  <Typography variant="body2" component="span" noWrap>防御</Typography>
                </TableCell>
                <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                  <Typography variant="body2" component="span" noWrap>頭装備</Typography>
                </TableCell>
                <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                  <Typography variant="body2" component="span" noWrap>胴装備</Typography>
                </TableCell>
                <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                  <Typography variant="body2" component="span" noWrap>腕装備</Typography>
                </TableCell>
                <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                  <Typography variant="body2" component="span" noWrap>腰装備</Typography>
                </TableCell>
                <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                  <Typography variant="body2" component="span" noWrap>足装備</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.map((equip, i) =>
                <SimulatorResultRow key={i} equip={equip} open={opens[i] || false} setOpen={open => setResultOpen(i, open)} />
              )}
              {loading && (
                [...Array(10 - result.length % 10).keys()].map(key =>
                  <TableRow key={key}>
                    <TableCell></TableCell>
                    <TableCell sx={{ px: 1 }}><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {completed && <Typography align="center">検索完了 {result.length}件</Typography>}
      {!loading && !completed && result.length > 0 && (
        <Button fullWidth onClick={more}>更に検索</Button>
      )}
    </div>
  )
}
