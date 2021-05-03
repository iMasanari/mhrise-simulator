import { css, Theme } from '@emotion/react'
import { Box, Button } from '@material-ui/core'
import React, { useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
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
  const [weaponSlot, setWeaponSlot] = useState<WeaponSlot>([0, 0, 0])
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
