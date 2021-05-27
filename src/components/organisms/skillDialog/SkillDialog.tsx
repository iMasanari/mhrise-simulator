import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Slide, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import { Close } from '@material-ui/icons'
import React, { useMemo, useRef, useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../../domain/skill'
import SkillList from './SkillList'

const useStyles = makeStyles(() => ({
  paper: {
    height: '100%',
  },
}))

interface Props {
  open: boolean
  skills: SkillSystem[]
  activeSkill: ActiveSkill
  onClose: (activeSkill: ActiveSkill) => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function SkillDialog({ open, skills, activeSkill, onClose }: Props) {
  const classes = useStyles()
  const [currentActiveSkill, setActiveSkill] = useState(activeSkill)
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')
  const categoryList = useMemo(() => [...new Set(skills.map(v => v.category))], [skills])
  const inputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()
  const fullScreen = !useMediaQuery(theme.breakpoints.up('sm'))

  const filterdSkills = useMemo(() => (
    skills.filter(v => (category ? v.category === category : v.name.includes(value)))
  ), [skills, value, category])

  const handleClose = () => {
    onClose(currentActiveSkill)
  }

  return (
    <Dialog open={open} fullScreen={fullScreen} onClose={handleClose} classes={{ paper: classes.paper }} fullWidth TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography variant="h6">
            {'スキル選択'}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogTitle disableTypography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              inputRef={inputRef}
              label="スキル名"
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="カテゴリー"
              size="small"
              fullWidth
              value={category}
              onChange={e => setCategory(e.currentTarget.value)}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {categoryList.map(v =>
                <option key={v} value={v}>{v}</option>
              )}
            </TextField>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0 }}>
        <SkillList skills={filterdSkills} activeSkill={currentActiveSkill} setActiveSkill={setActiveSkill} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth onClick={handleClose}>
          決定
        </Button>
      </DialogActions>
    </Dialog>
  )
}
