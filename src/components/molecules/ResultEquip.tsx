import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'
import { Equip } from '../../domain/equips'

interface Props {
  equip: Equip
}

const showSlots = (slots: [number, number, number] | undefined) =>
  slots?.map((s) => s ? `【${s}】` : null)

export default function ResultEquip({ equip }: Props) {
  const skills = Object.entries(equip.skills).sort(([, a], [, b]) => b - a)

  const armors = [equip.head, equip.body, equip.arm, equip.wst, equip.leg]
    .filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)

  const decos = equip.decos

  const slots = armors.flatMap(armor => armor.slots.map(s => [armor, s] as const))
    .sort(([, a], [, b]) => b - a)

  const decoList = decos.map((deco, i) => [slots[i][0], deco] as const)

  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell component="th">武器</TableCell>
          <TableCell>スロットなし</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">頭装備</TableCell>
          <TableCell>{equip.head?.name}</TableCell>
          <TableCell>{showSlots(equip.head?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.head).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">胴装備</TableCell>
          <TableCell>{equip.body?.name}</TableCell>
          <TableCell>{showSlots(equip.body?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.body).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">腕装備</TableCell>
          <TableCell>{equip.arm?.name}</TableCell>
          <TableCell>{showSlots(equip.arm?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.arm).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">腰装備</TableCell>
          <TableCell>{equip.wst?.name}</TableCell>
          <TableCell>{showSlots(equip.wst?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.wst).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">足装備</TableCell>
          <TableCell>{equip.leg?.name}</TableCell>
          <TableCell>{showSlots(equip.leg?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.leg).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">スキル</TableCell>
          <TableCell colSpan={3}>
            {skills.map(([skill, point]) =>
              <div key={skill}>
                {`${skill} Lv${point}`}
              </div>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
