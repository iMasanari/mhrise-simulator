import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { Link as LinkIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { Equip } from '../../../domain/equips'
import ResultEquip from '../../molecules/ResultEquip'
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
        <Button startIcon={<LinkIcon />} fullWidth sx={{ mt: 1 }} onClick={() => setShareDialogOpen(true)}>
          {'結果を共有する'}
        </Button>
      </DialogContent>
      {isShareDialogOpen && <ShareDialog open={isShareDialogOpen} onClose={() => setShareDialogOpen(false)} equip={equip} />}
    </Dialog>
  )
}
