import { css, Theme } from '@emotion/react'
import { Box, Tab, Tabs } from '@mui/material'
import { SkillSystem } from '../../domain/skill'
import { useSetMode, useSimulatorPageState } from '../../hooks/simualtorPageState'
import CharmSettings from '../organisms/charmSettings/CharmSettings'
import SimulatorAddableSkill from '../organisms/simulatorAddableSkill/SimulatorAddableSkill'
import SimulatorArmors from '../organisms/simulatorArmors/SimulatorArmors'
import SimulatorCondition from '../organisms/simulatorCondition/SimulatorCondition'
import SimulatorDecos from '../organisms/simulatorDecos/SimulatorDecos'
import SimulatorResult from '../organisms/simulatorResult/SimulatorResult'
import SimulatorUsage from '../organisms/simulatorUsage/SimulatorUsage'

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

export default function Simulator({ skills }: Props) {
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
            <Tab value="armors" label="除外防具" css={tabStyle} />
            <Tab value="decos" label="装飾品設定" css={tabStyle} />
          </Tabs>
          {mode === 'usage' && (
            <SimulatorUsage />
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
          {mode === 'armors' && (
            <SimulatorArmors />
          )}
          {mode === 'decos' && (
            <SimulatorDecos />
          )}
        </div>
      </div>
    </Box>
  )
}
