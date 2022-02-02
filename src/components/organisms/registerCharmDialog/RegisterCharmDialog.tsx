import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import { Charm, Slots } from '../../../domain/equips'
import SlotSelect from '../../molecules/SlotSelect'

const useStyles = makeStyles(() => ({
  paper: {
    alignItems: 'flex-start',
  },
}))

interface Props {
  open: boolean
  skills: { name: string, items: number[] }[]
  onClose: (charm?: Charm) => void
}

export default function RegisterCharmDialog({ open, onClose, skills }: Props) {
  const classes = useStyles()
  const [skillName1, setSkillName1] = useState('')
  const [skillPoint1, setSkillPoint1] = useState('')
  const [skillName2, setSkillName2] = useState('')
  const [skillPoint2, setSkillPoint2] = useState('')
  const [slots, setSlots] = useState<Slots>([])

  const defaultCharmText = [
    skillName1 && skillPoint1 && `${skillName1}x${skillPoint1}`,
    skillName2 && skillPoint2 && `${skillName2}x${skillPoint2}`,
    slots.length && `スロット${slots.map(v => `【${v}】`).join('')}`,
  ].filter(Boolean).join(' ')

  const defaultCharmName = `護石${defaultCharmText ? `（${defaultCharmText}）` : ''}`

  const handleClose = () => {
    const skillList: [string, number][] = [[skillName1, +skillPoint1], [skillName2, +skillPoint2]]
    const skills = Object.fromEntries(
      skillList.filter(([a, b]) => a && b)
    )

    onClose({ skills, slots })
  }

  return (
    <Dialog open={open} onClose={() => onClose()} classes={{ scrollPaper: classes.paper }} fullWidth>
      <DialogTitle>護石登録</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField select label="スキル1" fullWidth size="small" SelectProps={{ native: true }} value={skillName1} onChange={e => setSkillName1(e.currentTarget.value)}>
              <option value=""></option>
              {skills.map(v =>
                <option key={v.name} value={v.name}>{v.name}</option>
              )}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField select label="ポイント" fullWidth size="small" SelectProps={{ native: true }} value={skillPoint1} onChange={e => setSkillPoint1(e.currentTarget.value)}>
              {[...Array(8).keys()].map(v =>
                <option key={v} value={v || ''}>{v || ''}</option>
              )}
            </TextField>
          </Grid>
          <Grid item xs={8}>
            <TextField select label="スキル2" fullWidth size="small" SelectProps={{ native: true }} value={skillName2} onChange={e => setSkillName2(e.currentTarget.value)}>
              <option value=""></option>
              {skills.map(v =>
                <option key={v.name} value={v.name}>{v.name}</option>
              )}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField select label="ポイント" fullWidth size="small" SelectProps={{ native: true }} value={skillPoint2} onChange={e => setSkillPoint2(e.currentTarget.value)}>
              {[...Array(8).keys()].map(v =>
                <option key={v} value={v || ''}>{v || ''}</option>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>スロット</InputLabel>
              <SlotSelect label="スロット" slot={slots} setSlot={setSlots} />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  )
}
