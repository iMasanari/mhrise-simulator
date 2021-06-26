import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@material-ui/core'
import { Link as LinkIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { Equip } from '../../../domain/equips'
import ResultEquip from '../../molecules/ResultEquip'
import ResultSkills from '../../molecules/ResultSkills'
import ShareDialog from './ShareDialog'

interface Props {
  equip: Equip
  open: boolean
  onClose: () => void
}

export default function SimulatorResultRow({ equip, open, onClose }: Props) {
  const [isShareDialogOpen, setShareDialogOpen] = useState(false)

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>装備詳細</DialogTitle>
      <DialogContent>
        <ResultEquip equip={equip} size="small" />
        <Box mt={2}>
          <Typography>発動スキル</Typography>
          <ResultSkills equip={equip} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<LinkIcon />} fullWidth sx={{ mt: 1 }} onClick={() => setShareDialogOpen(true)}>
          {'結果を共有する'}
        </Button>
      </DialogActions>
      {isShareDialogOpen && <ShareDialog open={isShareDialogOpen} onClose={() => setShareDialogOpen(false)} equip={equip} />}
    </Dialog>
  )
}
