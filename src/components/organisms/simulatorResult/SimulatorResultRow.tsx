import { css } from '@emotion/react'
import { Box, Button, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp, Link as LinkIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { Equip } from '../../../domain/equips'
import ResultEquip from '../../molecules/ResultEquip'
import ResultSkills from '../../molecules/ResultSkills'
import ShareDialog from './ShareDialog'

const rowRootStyle = css`
  & > td {
    border-bottom: unset;
  }
`

interface Props {
  equip: Equip
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SimulatorResultRow({ equip, open, setOpen }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [fire, water, thunder, ice, dragon] = equip.elements

  return (
    <>
      <TableRow css={rowRootStyle} onClick={() => setOpen(!open)} hover>
        <TableCell sx={{ px: 0.5, py: 0 }}>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          {equip.def}
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.head?.series || '装備なし'}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.body?.series || '装備なし'}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.arm?.series || '装備なし'}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.wst?.series || '装備なし'}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.leg?.series || '装備なし'}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0, maxWidth: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box m={1}>
              <ResultEquip equip={equip} size="small" />
              <TableContainer component={Paper} sx={{ my: 1 }} variant="outlined">
                <Table sx={{ tableLayout: 'fixed' }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" align="center">防御</TableCell>
                      <TableCell component="th" align="center">火耐性</TableCell>
                      <TableCell component="th" align="center">水耐性</TableCell>
                      <TableCell component="th" align="center">雷耐性</TableCell>
                      <TableCell component="th" align="center">氷耐性</TableCell>
                      <TableCell component="th" align="center">龍耐性</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">{equip.def}</TableCell>
                      <TableCell align="center">{fire}</TableCell>
                      <TableCell align="center">{water}</TableCell>
                      <TableCell align="center">{thunder}</TableCell>
                      <TableCell align="center">{ice}</TableCell>
                      <TableCell align="center">{dragon}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="outlined" startIcon={<LinkIcon />} fullWidth sx={{ mt: 1 }} onClick={() => setDialogOpen(true)}>
                結果を共有する
              </Button>
              <Box my={2}>
                <Typography gutterBottom>発動スキル</Typography>
                <ResultSkills equip={equip} />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {isDialogOpen && <ShareDialog open={isDialogOpen} onClose={() => setDialogOpen(false)} equip={equip} />}
    </>
  )
}
