import { css, Theme } from '@emotion/react'
import { Box, Button, Tab, Tabs } from '@material-ui/core'
import { Mode } from '@material-ui/icons'
import React, { useState } from 'react'
import { Slots } from '../../domain/equips'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { useSimulator } from '../../hooks/simulatorHooks'
import { useUpdateSkillLog } from '../../hooks/skillLogHooks'
import DevelopWarning from '../molecules/DevelopWarning'
import SimulatorAddableSkill from '../organisms/simulatorAddableSkill/SimulatorAddableSkill'
import SimulatorCondition from '../organisms/simulatorCondition/SimulatorCondition'
import SimulatorResult from '../organisms/simulatorResult/SimulatorResult'

interface Props {
  skills: SkillSystem[]
}

const containerStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    display: flex;
  }
`

const conditionStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    width: 320px;
  }
`

const resultStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    width: calc(100% - 320px);
  }
`

export default function Simulator({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<Slots>([])
  const { loading, completed, result, addableSkillList, simulate, more, searchAddableSkillList } = useSimulator()
  const [mode, setMode] = useState('result' as 'result' | 'addSkill')

  const updateSkillLog = useUpdateSkillLog()

  const execute = () => {
    setMode('result')
    simulate(activeSkill, weaponSlot)
    updateSkillLog(activeSkill)
  }

  const addSkill = () => {
    setMode('addSkill')
    searchAddableSkillList(activeSkill, weaponSlot)
    updateSkillLog(activeSkill)
  }

  return (
    <Box sx={{ my: 4 }}>
      <DevelopWarning />
      <div css={containerStyle}>
        <div css={conditionStyle}>
          <SimulatorCondition
            skills={skills}
            activeSkill={activeSkill}
            setActiveSkill={setActiveSkill}
            weaponSlot={weaponSlot}
            setWeaponSlot={setWeaponSlot}
          />
          <Box display="flex" mx={2}>
            <Button onClick={execute} variant="contained" sx={{ flex: '1', mr: 1 }}>検索</Button>
            <Button onClick={addSkill} variant="outlined">追加スキル検索</Button>
          </Box>
        </div>
        <div css={resultStyle}>
          <Tabs value={mode} onChange={(_, value) => setMode(value)} aria-label="label tabs">
            <Tab value="result" label="検索結果" />
            <Tab value="addSkill" label="追加スキル" />
          </Tabs>
          {mode === 'result' && (
            <SimulatorResult result={result} loading={loading} completed={completed} more={more} />
          )}
          {mode === 'addSkill' && (
            <SimulatorAddableSkill skills={addableSkillList} completed={completed} setActiveSkill={setActiveSkill} />
          )}
        </div>
      </div>
    </Box>
  )
}
