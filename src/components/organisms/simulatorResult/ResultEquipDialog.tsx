import { Box, Button, Dialog, DialogActions, DialogContent, Slide, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import { Link as LinkIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import React, { useState } from 'react'
import { Equip } from '../../../domain/equips'
import DialogHeader from '../../molecules/DialogHeader'
import ResultEquip from '../../molecules/ResultEquip'
import ResultSkills from '../../molecules/ResultSkills'
import ShareDialog from './ShareDialog'

const useStyles = makeStyles(() => ({
  paper: {
    height: '100%',
  },
}))

interface Props {
  equip: Equip
  open: boolean
  onClose: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function SimulatorResultRow({ equip, open, onClose }: Props) {
  const classes = useStyles()
  const [isShareDialogOpen, setShareDialogOpen] = useState(false)
  const theme = useTheme()
  const fullScreen = !useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Dialog open={open} fullScreen={fullScreen} onClose={onClose} classes={{ paper: classes.paper }} fullWidth TransitionComponent={Transition}>
      <DialogHeader title="装備詳細" onClose={onClose} />
      <DialogContent>
        <ResultEquip equip={equip} size="small" />
        <Box mt={2}>
          <Typography>発動スキル</Typography>
          <ResultSkills equip={equip} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<LinkIcon />} fullWidth onClick={() => setShareDialogOpen(true)} variant="outlined">
          結果を共有する
        </Button>
        <Button onClick={onClose} fullWidth>
          閉じる
        </Button>
      </DialogActions>
      {isShareDialogOpen && <ShareDialog open={isShareDialogOpen} onClose={() => setShareDialogOpen(false)} equip={equip} />}
    </Dialog>
  )
}
