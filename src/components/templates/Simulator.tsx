import { css, Global, Theme } from '@emotion/react'
import { Tab, Tabs } from '@material-ui/core'
import React from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { useSetMode, useSimulatorPageState } from '../../hooks/simualtorPageState'
import CharmSettings from '../organisms/charmSettings/CharmSettings'
import SimulatorAddableSkill from '../organisms/simulatorAddableSkill/SimulatorAddableSkill'
import SimulatorCondition from '../organisms/simulatorCondition/SimulatorCondition'
import SimulatorResult from '../organisms/simulatorResult/SimulatorResult'
import SimulatorUsage from '../organisms/simulatorUsage/SimulatorUsage'

interface Props {
  skills: SkillSystem[]
  shares: { id: string, skills: ActiveSkill }[]
}

const globalStyle = (theme: Theme) => css`
body {
  ${theme.breakpoints.up('sm')} {
    overflow: hidden;
  }
}
#__next {
  display: flex;
  flex-direction: column;
  ${theme.breakpoints.up('sm')} {
    height: 100vh;
  }
}
`

const containerStyle = (theme: Theme) => css`
  flex: 1;
  overflow: hidden;
  ${theme.breakpoints.up('sm')} {
    display: flex;
  }
`

const conditionStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  ${theme.breakpoints.up('sm')} {
    width: 320px;
  }
`

const resultStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  ${theme.breakpoints.up('sm')} {
    width: calc(100% - 320px);
    min-height: auto;
  }
`

const tabStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    min-width: auto;
  }
`

const tabContentsStyle = (theme: Theme) => css`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${theme.spacing(1)};
`

export default function Simulator({ skills, shares }: Props) {
  const { mode } = useSimulatorPageState()
  const setMode = useSetMode()

  return (
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
        <div css={tabContentsStyle}>
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
      <Global styles={globalStyle} />
    </div>
  )
}
