import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core'
import { ContentCopy } from '@material-ui/icons'
import React, { useEffect, useRef, useState } from 'react'
import { Charm, Equip } from '../../../domain/equips'

const useStyles = makeStyles(() => ({
  paper: {
    alignItems: 'flex-start',
  },
}))

interface Props {
  open: boolean
  onClose: (charm?: Charm) => void
  equip: Equip
}

export default function ShareDialog({ open, onClose, equip }: Props) {
  const classes = useStyles()
  const [shareId, setShareId] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current?.select()
  }, [shareId])

  const createUrl = async () => {
    const data = {
      weaponSlots: equip.weaponSlot,
      head: equip.head?.name,
      body: equip.body?.name,
      arm: equip.arm?.name,
      wst: equip.wst?.name,
      leg: equip.leg?.name,
      charm: equip.charm,
      decos: equip.decos.map(v => v.name),
    }

    const res = await fetch('/api/shares', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const { id } = await res.json()

    setShareId(id)
  }

  const onClick = () => {
    inputRef.current?.select()
  }

  return (
    <Dialog open={open} onClose={() => onClose()} classes={{ scrollPaper: classes.paper }} fullWidth>
      <DialogTitle>結果の共有</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          {'この装備の内容を共有するリンクを生成します。'}
        </Typography>
        {shareId ? (
          <TextField
            inputRef={inputRef}
            value={`${location.origin}/shares/${shareId}`}
            size="small"
            fullWidth
            inputProps={{ readOnly: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={onClick}>
                    <ContentCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Button variant="outlined" fullWidth onClick={createUrl}>
            {'生成'}
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>
          {'閉じる'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
