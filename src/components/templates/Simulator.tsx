import { css, Theme } from '@emotion/react'
import { Box, Button, Collapse, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import React, { useState } from 'react'
import { Equip } from '../../domain/equips'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import { useSimulator } from '../../hooks/simulatorHooks'
import DevelopWarning from '../molecules/DevelopWarning'
import ResultEquip from '../molecules/ResultEquip'
import SimulateCondition from '../organisms/SimulateCondition'

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

const resultRowRootStyle = css`
  & > td {
    border-bottom: unset;
  }
`

const ResultRow = ({ equip }: { equip: Equip }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow css={resultRowRootStyle} onClick={() => setOpen(!open)} hover>
        <TableCell sx={{ px: 0.5, py: 0 }}>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          {equip.def}
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.head?.series}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.body?.series}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.arm?.series}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.wst?.series}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          <Typography variant="body2" component="div" noWrap overflow="hidden" textOverflow="ellipsis" sx={{ minWidth: '6em' }}>
            {equip.leg?.series}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <ResultEquip equip={equip} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function Simulator({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<WeaponSlot>([0, 0, 0])
  const { loading, finish, result, simulate, more } = useSimulator()

  const execute = () =>
    simulate(activeSkill as Record<string, number>)

  return (
    <Box sx={{ my: 4 }}>
      <DevelopWarning />
      <div css={containerStyle}>
        <div css={conditionStyle}>
          <SimulateCondition
            skills={skills}
            activeSkill={activeSkill}
            setActiveSkill={setActiveSkill}
            weaponSlot={weaponSlot}
            setWeaponSlot={setWeaponSlot}
          />
          <Button onClick={execute}>検索</Button>
        </div>
        <div css={resultStyle}>
          {(result.length > 0 || loading) && (
            <TableContainer component={Paper} sx={{ my: 1 }} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th" sx={{ px: 0.5 }}></TableCell>
                    <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                      <Typography variant="body2" component="span" noWrap>防御</Typography>
                    </TableCell>
                    <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                      <Typography variant="body2" component="span" noWrap>頭装備</Typography>
                    </TableCell>
                    <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                      <Typography variant="body2" component="span" noWrap>胴装備</Typography>
                    </TableCell>
                    <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                      <Typography variant="body2" component="span" noWrap>腕装備</Typography>
                    </TableCell>
                    <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                      <Typography variant="body2" component="span" noWrap>腰装備</Typography>
                    </TableCell>
                    <TableCell component="th" align="center" sx={{ px: 0.5 }}>
                      <Typography variant="body2" component="span" noWrap>足装備</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((equip, i) =>
                    <ResultRow key={i} equip={equip} />
                  )}
                  {loading && (
                    [...Array(10 - result.length % 10).keys()].map(key =>
                      <TableRow key={key}>
                        <TableCell></TableCell>
                        <TableCell sx={{ px: 1 }}><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {finish && <Typography align="center">検索完了 {result.length}件</Typography>}
          {!loading && !finish && result.length > 0 && (
            <Button fullWidth onClick={more}>更に検索</Button>
          )}
        </div>
      </div>
    </Box>
  )
}
