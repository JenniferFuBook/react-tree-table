import { useEffect, useMemo, useState } from 'react';
import { Button, Table } from 'antd';
import { EnterOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  createNewRow,
  createTableData,
  getAllParentNodeKeys,
  getTableRowCount,
  removeRowFromTableData,
} from './utils';

const Container = styled.div`
  div, td {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  td.ant-table-cell.ant-table-cell-with-append {
    display: flex;
    flex-wrap: nowrap;

    button.ant-table-row-expand-icon.ant-table-row-expand-icon-collapsed,
    button.ant-table-row-expand-icon.ant-table-row-expand-icon-expanded {
      flex-shrink: 0;
    }
  }
`;

const ButtonAction = styled(Button)`
  margin-left: 10px;
`;

const FlippedEnterIcon = styled(EnterOutlined)`
  && {
    overflow: visible;
    padding-top: 2px;
    padding-right: 10px;
    svg {
      transform: scaleX(-1);
    }
  }
`;

export const TreeTable = () => {
  const [tableData, setTableData] = useState(createTableData(10));
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [newRowName, setNewRowName] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableNodeCount, setTableNodeCount] = useState(0);

  useEffect(() => {
    if (newRowName) {
      const newRowElement = document.querySelector(
        `[data-row-key='${newRowName}']`
      );
      newRowElement.scrollIntoView(false);
    }
  }, [newRowName]);

  useEffect(() => setTableNodeCount(getTableRowCount(tableData)), [tableData]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
          <>
            {record.parent && <FlippedEnterIcon />}
            <div>{name}</div>
          </>
        ),
      },
      { title: 'Country', dataIndex: 'country', key: 'country' },
      {
        title: 'Add',
        dataIndex: '',
        key: 'add',
        render: () => <a>Add a child</a>,
        onCell: (record) => {
          return {
            onClick: () => {
              if (!Array.isArray(record.children)) {
                record.children = [];
              }
              const newRow = createNewRow();
              newRow.parent = record;
              record.children = [...record.children, newRow];
              setTableData([...tableData]);
              setExpandedRowKeys(new Set([...expandedRowKeys, record.key]));
              setNewRowName(newRow.name);
              setSelectedRowKeys([newRow.key]);
            },
          };
        },
      },
      {
        title: 'Remove',
        dataIndex: '',
        key: 'remove',
        render: () => <a>Remove the node</a>,
        onCell: (record) => {
          return {
            onClick: () => {
              const expandedRowKeySet = new Set(expandedRowKeys);
              if (record.parent) {
                removeRowFromTableData(record.parent.children, record.key);
                if (record.parent.children.length === 0) {
                  delete record.parent.children;
                }
              } else {
                removeRowFromTableData(tableData, record.key);
              }
              setTableData([...tableData]);
              expandedRowKeySet.delete(record.key);
              setExpandedRowKeys(expandedRowKeySet);
              setNewRowName();
              setSelectedRowKeys([]);
            },
          };
        },
      },
    ],
    [tableData, setTableData, expandedRowKeys, setExpandedRowKeys]
  );

  return (
    <Container>
      <Table
        pagination={{ position: [] }}
        footer={() => (
          <>
            <span>Total count: {tableNodeCount}</span>
            <ButtonAction
              onClick={() => {
                setExpandedRowKeys(getAllParentNodeKeys(tableData));
                setSelectedRowKeys([]);
                setNewRowName();
              }}
            >
              Open All
            </ButtonAction>
            <ButtonAction
              onClick={() => {
                setExpandedRowKeys([]);
                setSelectedRowKeys([]);
                setNewRowName();
              }}
            >
              Collapse All
            </ButtonAction>
          </>
        )}
        rowSelection={{ selectedRowKeys, type: 'radio' }}
        columns={columns}
        dataSource={tableData}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (expandedRows) => {
            setExpandedRowKeys(expandedRows);
            setSelectedRowKeys([]);
          },
        }}
        scroll={{ y: 500 }}
      />
    </Container>
  );
};
