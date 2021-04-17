import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import React from 'react'
import { Result } from '../../domain/simulator'

interface Props {
  result: Result
}

export default function ResultEquip({ result }: Props) {
  return (
    <TableContainer component={Paper} sx={{ my: 1 }} variant="outlined">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>頭装備</TableCell>
            <TableCell>{result.head}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>胴装備</TableCell>
            <TableCell>{result.body}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>腕装備</TableCell>
            <TableCell>{result.arm}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>腰装備</TableCell>
            <TableCell>{result.wst}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>足装備</TableCell>
            <TableCell>{result.leg}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>装飾品</TableCell>
            <TableCell>
              {result.deco.map(([name, count]) =>
                <div key={name}>{name} x{count}</div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
