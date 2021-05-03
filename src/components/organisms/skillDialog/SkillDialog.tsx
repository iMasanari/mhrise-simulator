import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, makeStyles, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import React, { useMemo, useRef, useState } from 'react'
import { ActiveSkill } from '../../../domain/skill'
import SkillList from './SkillList'

const useStyles = makeStyles(() => ({
  paper: {
    alignItems: 'flex-start',
  },
}))

interface Props {
  open: boolean
  skills: { name: string, items: number[] }[]
  activeSkill: ActiveSkill
  onClose: (activeSkill: ActiveSkill) => void
}

export default function SkillDialog({ open, skills, activeSkill, onClose }: Props) {
  const classes = useStyles()
  const [currentActiveSkill, setActiveSkill] = useState(activeSkill)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filterdSkills = useMemo(() => (
    skills.filter(v => v.name.includes(value))
  ), [skills, value])

  const handleClose = () => {
    onClose(currentActiveSkill)
  }

  return (
    <Dialog open={open} onClose={handleClose} classes={{ scrollPaper: classes.paper }} fullWidth>
      <DialogTitle>
        <TextField
          inputRef={inputRef}
          label="スキル"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => inputRef.current?.focus()}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0 }}>
        <SkillList skills={filterdSkills} activeSkill={currentActiveSkill} setActiveSkill={setActiveSkill} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          決定
        </Button>
      </DialogActions>
    </Dialog>
  )
}
