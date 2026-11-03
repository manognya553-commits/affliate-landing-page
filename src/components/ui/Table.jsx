import React from 'react'

/**
 * Reusable sBLOOM Data Table component
 */
export default function Table({
  columns = [],
  data = [],
  keyExtractor = (item, idx) => item?.id || idx,
  emptyMessage = 'No records found.',
  onRowClick,
  className = '',
}) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-[#E8E2D8] bg-white/70 shadow-sm ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#E8E2D8] bg-[#F3ECE1]/70 text-[#575266] uppercase text-[11px] tracking-wider font-semibold">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E2D8]/60 text-[#12101F]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-4 text-center text-[#575266]"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => {
              const rowKey = keyExtractor(item, rowIdx)
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-[#FAF7F2] transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`py-4 px-4 align-middle ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(item, rowIdx) : item[col.key]}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
