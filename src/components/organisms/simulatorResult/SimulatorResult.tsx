import { css, Theme } from '@emotion/react'
import { Box, Button, LinearProgress, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { DataGrid, GridColDef, GridOverlay, GridRowsProp } from '@material-ui/data-grid'
import React, { useMemo } from 'react'
import { useSetResultOpen, useSetSelectionModel, useSimulatorPageState } from '../../../hooks/simualtorPageState'
import { useSimulator } from '../../../hooks/simulatorHooks'
import ResultEquipDialog from './ResultEquipDialog'

const columns: GridColDef[] = [
  { field: 'def', headerName: '防御', type: 'number' },
  { field: 'head', headerName: '頭装備', align: 'center' },
  { field: 'body', headerName: '胴装備', align: 'center' },
  { field: 'arm', headerName: '腕装備', align: 'center' },
  { field: 'wst', headerName: '腰装備', align: 'center' },
  { field: 'leg', headerName: '足装備', align: 'center' },
  { field: 'fire', headerName: '火耐性', type: 'number' },
  { field: 'water', headerName: '水耐性', type: 'number' },
  { field: 'thunder', headerName: '雷耐性', type: 'number' },
  { field: 'ice', headerName: '氷耐性', type: 'number' },
  { field: 'dragon', headerName: '龍耐性', type: 'number' },
]

const wraperStyle = (theme: Theme) => css`
  ${theme.breakpoints.up('sm')} {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`

function LoadingOverlay() {
  return (
    <GridOverlay>
      <Box position="absolute" top={0} width="100%">
        <LinearProgress />
      </Box>
    </GridOverlay>
  )
}

interface FooterProps {
  completed: boolean
  loading: boolean
  resultCount: number
  more: () => void
}

function Footer({ completed, loading, resultCount, more }: FooterProps) {
  return (
    <div>
      {completed && <Typography align="center">検索完了 {resultCount}件</Typography>}
      {!completed && resultCount > 0 && (
        <Button fullWidth onClick={more} disabled={loading}>更に検索</Button>
      )}
    </div>
  )
}

export default function SimulatorResult() {
  const { result, loading, completed, more } = useSimulator()
  const { resultOpen, selectionModel } = useSimulatorPageState()
  const setSelectionModel = useSetSelectionModel()
  const setResultOpen = useSetResultOpen()
  const theme = useTheme()
  const isAutoHeight = !useMediaQuery(theme.breakpoints.up('sm'))

  const rows: GridRowsProp = useMemo(() => (
    result.map(({ def, head, body, arm, wst, leg, elements: [fire, water, thunder, ice, dragon] }, index) => ({
      id: index,
      def,
      head: head ? head.series || head.name : '(装備なし)',
      body: body ? body.series || body.name : '(装備なし)',
      arm: arm ? arm.series || arm.name : '(装備なし)',
      wst: wst ? wst.series || wst.name : '(装備なし)',
      leg: leg ? leg.series || leg.name : '(装備なし)',
      fire,
      water,
      thunder,
      ice,
      dragon,
    }))
  ), [result])

  const selectedResult = resultOpen ? result[selectionModel[0] as number] : null

  return (
    <div css={wraperStyle}>
      <DataGrid
        components={{ LoadingOverlay, Footer }}
        componentsProps={{
          footer: { completed, loading, resultCount: result.length, more },
        }}
        rows={rows}
        columns={columns}
        disableColumnMenu={true}
        onRowClick={() => setResultOpen(true)}
        onSelectionModelChange={(newSelection) => setSelectionModel(newSelection.selectionModel)}
        selectionModel={selectionModel}
        loading={loading}
        autoHeight={isAutoHeight}
      />
      {selectedResult &&
        <ResultEquipDialog
          open={true}
          equip={selectedResult}
          onClose={() => setResultOpen(false)}
        />
      }
    </div>
  )
}
