import { Box, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import { useSimulator } from '../../hooks/simulatorHooks'
import DevelopWarning from '../molecules/DevelopWarning'
import ResultEquip from '../molecules/ResultEquip'
import SimulateCondition from '../organisms/SimulateCondition'

interface Props {
  skills: SkillSystem[]
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
      <SimulateCondition
        skills={skills}
        activeSkill={activeSkill}
        setActiveSkill={setActiveSkill}
        weaponSlot={weaponSlot}
        setWeaponSlot={setWeaponSlot}
      />
      <Button onClick={execute}>検索</Button>
      {(result.length > 0 || loading) && (
        <TableContainer component={Paper} sx={{ my: 1 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" align="center">
                  <Typography variant="body2" component="span" noWrap>防御</Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body2" component="span" noWrap>頭装備</Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body2" component="span" noWrap>胴装備</Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body2" component="span" noWrap>腕装備</Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body2" component="span" noWrap>腰装備</Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body2" component="span" noWrap>足装備</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.map((equip, i) =>
                <TableRow key={i}>
                  <TableCell align="center">
                    {equip.def}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" component="span" noWrap>{equip.head?.series}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" component="span" noWrap>{equip.body?.series}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" component="span" noWrap>{equip.arm?.series}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" component="span" noWrap>{equip.wst?.series}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" component="span" noWrap>{equip.leg?.series}</Typography>
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                [...Array(10 - result.length % 10).keys()].map(key =>
                  <TableRow key={key}>
                    <TableCell><Skeleton variant="text" /></TableCell>
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
    </Box>
  )
}
