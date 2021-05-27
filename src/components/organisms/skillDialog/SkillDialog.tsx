import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, makeStyles, Select, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import React, { useMemo, useRef, useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../../domain/skill'
import SkillList from './SkillList'

const useStyles = makeStyles(() => ({
  paper: {
    alignItems: 'flex-start',
  },
}))

interface Props {
  open: boolean
  skills: SkillSystem[]
  activeSkill: ActiveSkill
  onClose: (activeSkill: ActiveSkill) => void
}

export default function SkillDialog({ open, skills, activeSkill, onClose }: Props) {
  const classes = useStyles()
  const [currentActiveSkill, setActiveSkill] = useState(activeSkill)
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')
  const categoryList = useMemo(() => [...new Set(skills.map(v => v.category))], [skills])
  const inputRef = useRef<HTMLInputElement>(null)

  const filterdSkills = useMemo(() => (
    skills.filter(v => (category ? v.category === category : v.name.includes(value)))
  ), [skills, value, category])

  const handleClose = () => {
    onClose(currentActiveSkill)
  }

  return (
    <Dialog open={open} onClose={handleClose} classes={{ scrollPaper: classes.paper }} fullWidth>
      <DialogTitle>
        <TextField
          inputRef={inputRef}
          label="スキル名"
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
        <TextField
          select
          label="カテゴリー"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          value={category}
          onChange={e => setCategory(e.currentTarget.value)}
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          {categoryList.map(v =>
            <option key={v} value={v}>{v}</option>
          )}
        </TextField>
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
