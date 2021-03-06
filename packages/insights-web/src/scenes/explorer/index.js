import './styles.scss'

import React, { useState } from 'react'
import { useActions, useMountedLogic, useValues } from 'kea'

import { Layout, LayoutSplitter } from 'react-flex-layout'
import { Button } from "antd";

import Graph from './graph'
import TimeFilter from './time-filter'
import Pagination from './pagination'
import Sidebar from './sidebar'
import Table from './table'
import Filter from './filter'
import Dashboard from './dashboard'

import explorerLogic from 'scenes/explorer/logic'
import explorerSaga from 'scenes/explorer/saga'
import layoutLogic from '../_layout/logic'

export default function Explorer () {
  useMountedLogic(explorerSaga)

  const { isSubmitting, columns, hasGraph, selectedModel } = useValues(explorerLogic)
  const { refreshData } = useActions(explorerLogic)
  const { menuOpen } = useValues(layoutLogic)

  const [filterHeight, setFilterHeight] = useState(40)

  return (
    <Layout className={`explorer-scene${!selectedModel || columns.length === 0 ? ' with-dashboard' : ''}`}>
      <Layout layoutWidth={menuOpen ? 300 : 1} className='explorer-tree-bar'>
        {menuOpen ? <Sidebar /> : null}
      </Layout>
      <LayoutSplitter />
      {!selectedModel || columns.length === 0 ? (
        <Layout layoutWidth='flex' className='explorer-dashboard-layout'>
          <Dashboard />
        </Layout>
      ) : (
        <Layout layoutWidth='flex' className='explorer-table-layout'>
          <Layout layoutHeight={50}>
            <div style={{padding: 10}} className='min-width'>
              <div className='top-controls'>
                {columns.length > 0 ? (
                  <Button icon='reload' loading={isSubmitting} onClick={refreshData}>
                    Reload
                  </Button>
                ) : null}
                {hasGraph ? (
                  <TimeFilter />
                ) : null}
              </div>
              <div className='top-pagination'>
                <Pagination />
              </div>
            </div>
          </Layout>
          <Layout layoutHeight={filterHeight}>
            {selectedModel ? <Filter filterHeight={filterHeight} setFilterHeight={setFilterHeight} /> : null}
          </Layout>
          {hasGraph ? (
            <Layout layoutHeight={300} className='visible-overflow'>
              <Graph />
            </Layout>
          ) : <div />}
          {hasGraph ? <LayoutSplitter /> : <div />}
          <Layout layoutHeight='flex'>
            <Table />
          </Layout>
        </Layout>
      )}
    </Layout>
  )
}
