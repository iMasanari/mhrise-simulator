import { css, Theme } from '@emotion/react'
import { Box, Tab, Tabs } from '@material-ui/core'
import React from 'react'
import { SkillSystem } from '../../domain/skill'
import { useSetMode, useSimulatorPageState } from '../../hooks/simualtorPageState'
import { Share } from '../molecules/ShareList'
import CharmSettings from '../organisms/charmSettings/CharmSettings'
import SimulatorAddableSkill from '../organisms/simulatorAddableSkill/SimulatorAddableSkill'
import SimulatorCondition from '../organisms/simulatorCondition/SimulatorCondition'
import SimulatorResult from '../organisms/simulatorResult/SimulatorResult'
import SimulatorUsage from '../organisms/simulatorUsage/SimulatorUsage'

interface Props {
  skills: SkillSystem[]
  shares: Share[]
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
  const { mode } = useSimulatorPageState()
  const setMode = useSetMode()

  return (
    <Box my={2} >
      <div css={containerStyle}>
        <div css={conditionStyle}>
          <SimulatorCondition skills={skills} />
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
            <Tab value="addableSkill" label="追加スキル" css={tabStyle} />
            <Tab value="charms" label="護石設定" css={tabStyle} />
          </Tabs>
          {mode === 'usage' && (
            <SimulatorUsage shares={shares} />
          )}
          {mode === 'result' && (
            <SimulatorResult />
          )}
          {mode === 'addableSkill' && (
            <SimulatorAddableSkill />
          )}
          {mode === 'charms' && (
            <CharmSettings skills={skills} />
          )}
        </div>
      </div>
    </Box>
  )
}
