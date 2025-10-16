import React from 'react';
import { BaseTable, TableHeader, TableBody, TableRow } from './BaseTable';
import { TableHeaderCell, TableCell } from './TableCells';
import { getColumnValue } from '../utils/tableUtils';
import { renderCell } from '../utils/cellRenderers';

export const SimpleTable = ({
  data = [],
  columns = [],
  density = 'normal',
  bordered = true,
  striped = false,
  hoverable = true,
  className = '',
  ...props
}) => {
  if (!data || data.length === 0) {
    return (
      <BaseTable 
        density={density}
        bordered={bordered}
        striped={striped}
        hoverable={hoverable}
        className={className}
        {...props}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHeaderCell 
                key={column.key || index} 
                align={column.align}
              >
                {column.title}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell 
              colSpan={columns.length}
              align="center"
              className="py-8 text-gray-500"
            >
              Tidak ada data tersedia
            </TableCell>
          </TableRow>
        </TableBody>
      </BaseTable>
    );
  }

  return (
    <BaseTable 
      density={density}
      bordered={bordered}
      striped={striped}
      hoverable={hoverable}
      className={className}
      {...props}
    >
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeaderCell 
              key={column.key || index} 
              align={column.align}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.title}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.id || rowIndex}>
            {columns.map((column, colIndex) => {
              const cellValue = getColumnValue(row, column);
              
              return (
                <TableCell 
                  key={column.key || colIndex} 
                  align={column.align}
                >
                  {typeof cellValue === 'object' && cellValue?.type 
                    ? renderCell(cellValue)
                    : cellValue
                  }
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </BaseTable>
  );
};