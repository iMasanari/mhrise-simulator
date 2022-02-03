import { css, Theme } from '@emotion/react'
import { Box, Breadcrumbs, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import React from 'react'
import { getSeries } from '../../api/armors'
import Link from '../../components/atoms/Link'
import MetaData from '../../components/templates/MetaData'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const tableCellHeadTitleStyle = (theme: Theme) => css`
  display: none;
  ${theme.breakpoints.up('sm')} {
    display: block;
    flex: 1 1 100px;
  }
`

const tableCellTitleStyle = (theme: Theme) => css`
  display: block;
  flex: 1 0 100%;
  display: flex;
  align-items: center;
  ${theme.breakpoints.up('sm')} {
    flex: 1 1 100px;
  }
`

const tableCellItemStyle = (theme: Theme) => css`
  display: block;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.breakpoints.up('sm')} {
    flex: 1 1 50px;
  }
`

const linkIconStyle = css`
  &:hover {
    opacity: 0.5;
  }
`

export const getStaticProps = async () => {
  const series = await getSeries()

  const data = series.map(v => {
    const armors = [v.head, v.body, v.arm, v.wst, v.leg].map(v => v ? v.name : null)

    return { name: v.name, armors }
  })

  return {
    props: { series: data },
  }
}

const images = [
  'head.svg',
  'body.svg',
  'arm.svg',
  'wst.svg',
  'leg.svg',
]

export default function SkillsPage({ series }: Props) {
  return (
    <Container maxWidth="md">
      <MetaData
        title="防具一覧 | MHRise スキルシミュ"
        description="MHRise スキルシミュで使用している防具の一覧です。"
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" underline="hover" href="/">Top</Link>
        <Typography color="textPrimary">防具一覧</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          防具一覧
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table sx={{ display: 'block' }}>
            <TableHead sx={{ display: 'block' }}>
              <TableRow sx={{ display: 'flex' }}>
                <TableCell component="th" css={tableCellHeadTitleStyle}></TableCell>
                <TableCell component="th" css={tableCellItemStyle}>頭</TableCell>
                <TableCell component="th" css={tableCellItemStyle}>胴</TableCell>
                <TableCell component="th" css={tableCellItemStyle}>腕</TableCell>
                <TableCell component="th" css={tableCellItemStyle}>腰</TableCell>
                <TableCell component="th" css={tableCellItemStyle}>足</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ display: 'block' }}>
              {series.map(armor =>
                <TableRow key={armor.name} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  <TableCell css={tableCellTitleStyle}>{armor.name}</TableCell>
                  {armor.armors.map((v, i) =>
                    <TableCell key={v || i} css={tableCellItemStyle}>
                      {v && (
                        <Link href={`/armors/${v}`} noWrap prefetch={false}>
                          <Image css={linkIconStyle} src={`/images/armors/${images[i]}`} width={24} height={24} />
                        </Link>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
