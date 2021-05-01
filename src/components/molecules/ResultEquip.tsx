import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import React from 'react'
import { Equip } from '../../domain/equips'

interface Props {
  result: Equip
}

export default function ResultEquip({ result }: Props) {
  return (
    <TableContainer component={Paper} sx={{ my: 1 }} variant="outlined">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>防御力</TableCell>
            <TableCell>{result.def}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>頭装備</TableCell>
            <TableCell>{result.head?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>胴装備</TableCell>
            <TableCell>{result.body?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>腕装備</TableCell>
            <TableCell>{result.arm?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>腰装備</TableCell>
            <TableCell>{result.wst?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>足装備</TableCell>
            <TableCell>{result.leg?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>装飾品</TableCell>
            <TableCell>
              {result.deco.map(([{ name }, count]) =>
                <div key={name}>{name} x{count}</div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
