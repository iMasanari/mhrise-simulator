import { css } from '@emotion/react'
import { Box, Button, Collapse, IconButton, TableCell, TableRow, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp, Link as LinkIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { Equip } from '../../../domain/equips'
import ResultEquip from '../../molecules/ResultEquip'
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
        <TableCell sx={{ py: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <ResultEquip equip={equip} size="small" />
              <Button startIcon={<LinkIcon />} fullWidth sx={{ mt: 1 }} onClick={() => setDialogOpen(true)}>
                {'結果を共有する'}
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {isDialogOpen && <ShareDialog open={isDialogOpen} onClose={() => setDialogOpen(false)} equip={equip} />}
    </>
  )
}
