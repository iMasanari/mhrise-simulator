import { css, Theme } from '@emotion/react'
import { Box, Button, Tab, Tabs } from '@material-ui/core'
import { Mode } from '@material-ui/icons'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Slots } from '../../domain/equips'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { useCharms } from '../../hooks/charmsHooks'
import { useSimulator } from '../../hooks/simulatorHooks'
import { useUpdateSkillLog } from '../../hooks/skillLogHooks'
import DevelopWarning from '../molecules/DevelopWarning'
import CharmSettings from '../organisms/charmSettings/CharmSettings'
import SimulatorAddableSkill from '../organisms/simulatorAddableSkill/SimulatorAddableSkill'
import SimulatorCondition from '../organisms/simulatorCondition/SimulatorCondition'
import SimulatorResult from '../organisms/simulatorResult/SimulatorResult'
import SimulatorUsage from '../organisms/simulatorUsage/SimulatorUsage'

interface Props {
  skills: SkillSystem[]
  shares: { id: string, skills: ActiveSkill }[]
}

type Mode = 'usage' | 'result' | 'addSkill' | 'charm'

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

const tabStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    min-width: auto;
  }
`

const resultStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    width: calc(100% - 320px);
  }
`

export default function Simulator({ skills, shares }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<Slots>([])
  const { loading, completed, result, addableSkillList, simulate, more, searchAddableSkillList } = useSimulator()
  const charms = useCharms()
  const [mode, setMode] = useState<Mode>('usage')
  const [autoExecute, setAutoExecute] = useState(false)
  const router = useRouter()

  const updateSkillLog = useUpdateSkillLog()

  const execute = () => {
    setMode('result')
    simulate(activeSkill, weaponSlot, charms)
    updateSkillLog(activeSkill)
  }

  const addSkill = () => {
    setMode('addSkill')
    searchAddableSkillList(activeSkill, weaponSlot, charms)
    updateSkillLog(activeSkill)
  }

  useEffect(() => {
    const query = location.search
    if (query.length < 2) return

    const searchParams = new URLSearchParams(query)

    const skills = Object.fromEntries(
      (searchParams.get('skills') || '').split(',')
        .map(v => v.split('Lv'))
        .map(([key, value]) => [key, +value])
    )

    const slots = (searchParams.get('weaponSlots') || '').split(',').map(Number)

    setActiveSkill(skills)
    setWeaponSlot(slots)
    setAutoExecute(true)

    router.replace(location.pathname)
  }, [router])

  useEffect(() => {
    if (autoExecute) {
      execute()
      setAutoExecute(false)
    }
    // eslint-disable-next-line
  }, [autoExecute])

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
          <Tabs
            variant="scrollable"
            value={mode}
            onChange={(_, value) => setMode(value)}
            aria-label="label tabs"
          >
            <Tab value="usage" label="使い方" css={tabStyle} />
            <Tab value="result" label="検索結果" css={tabStyle} />
            <Tab value="addSkill" label="追加スキル" css={tabStyle} />
            <Tab value="charm" label="護石設定" css={tabStyle} />
          </Tabs>
          {mode === 'usage' && (
            <SimulatorUsage shares={shares} />
          )}
          {mode === 'result' && (
            <SimulatorResult result={result} loading={loading} completed={completed} more={more} />
          )}
          {mode === 'addSkill' && (
            <SimulatorAddableSkill skills={addableSkillList} completed={completed} setActiveSkill={setActiveSkill} />
          )}
          {mode === 'charm' && (
            <CharmSettings skills={skills} />
          )}
        </div>
      </div>
    </Box>
  )
}
