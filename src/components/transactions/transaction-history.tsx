import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { columns } from './column';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DatePicker } from '@/components/ui/date-picker';
import { fetchUserTransactions } from '@/services/Transactions';
import { MobileDataCards, type CardField } from '@/components/ui/mobile-data-cards';
import { Badge } from '@/components/ui/base-badge';
import { formatCurrency, fullDateFormat } from '@/lib/utils';
import type { Transaction } from '@/types/transaction';


interface PageProps {
  pageIndex: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
}

const mobileFields: CardField<Transaction>[] = [
  {
    label: 'Date',
    value: (t) => fullDateFormat(t.date),
  },
  {
    label: 'Amount',
    value: (t) => formatCurrency(t.amount),
    bold: true,
  },
  {
    label: 'Type',
    value: (t) => t.category,
  },
];

export const TransactionsHistory = () => {

  const [pagination, setPagination] = useState<PageProps>({
    pageIndex: 0,
    pageSize: 10,
    startDate: '',
    endDate: '',
  });

  const { data: transactions, isFetching } = useQuery({
    queryKey: ['transactions', pagination],
    queryFn: () => fetchUserTransactions(pagination),
    placeholderData: keepPreviousData,
  })

  const defaultData = useMemo(() => [], [])

  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data: transactions?.data ?? defaultData,
    rowCount: transactions?.totalCount,
    state: {
      pagination,
      sorting,
      // columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    debugTable: true,

  });

  return (
    <DataGrid
      table={table}
      recordCount={transactions?.totalCount || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: false,
        stripped: true,
        headerBorder: false,
      }}
      isLoading={isFetching}
      loadingMode="skeleton"
      loadingMessage="Loading Transactions..."
      emptyMessage="No Transactions Found."
    >
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row border-b-0 flex-nowrap gap-4 px-0 pb-4">
          {/* start date */}
          <DatePicker
            value={pagination.startDate ? new Date(pagination.startDate) : undefined}
            onChange={(date) => setPagination((prev) => ({ ...prev, startDate: date?.toISOString() }))}
            placeholder="Select start date"
            className="w-full"
          />

          {/* end date */}
          <DatePicker
            value={pagination.endDate ? new Date(pagination.endDate) : undefined}
            onChange={(date) => setPagination((prev) => ({ ...prev, endDate: date?.toISOString() }))}
            placeholder="Select end date"
            className="w-full"
          />

        </CardHeader>

        {/* Mobile card view */}
        <div className="block md:hidden">
          <MobileDataCards<Transaction>
            data={transactions?.data ?? []}
            fields={mobileFields}
            keyAccessor={(t) => t.id}
            isLoading={isFetching}
            emptyMessage="No Transactions Found."
            cardHeader={(t) => (
              <>
                <span className="font-semibold text-sm text-foreground">#{t.id}</span>
                <Badge variant="success" appearance="outline" size="sm" shape="circle">
                  Success
                </Badge>
              </>
            )}
          />
        </div>

        {/* Desktop table view */}
        <CardTable className="hidden md:block">
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter className="p-0 flex items-center justify-between gap-2">


          <Pagination className="justify-start w-fit mx-0">
            <PaginationContent className='gap-2'>
              {/* Previous Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="text-muted-foreground rounded-full"
                  mode="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="rtl:rotate-180" />
                </Button>
              </PaginationItem>

              {/* Numbered Page Buttons */}
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <Button
                    variant={table.getState().pagination.pageIndex === pageIndex ? 'primary' : 'outline'}
                    className={`rounded-full ${table.getState().pagination.pageIndex === pageIndex
                      ? 'bg-primary-900 text-background'
                      : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    mode={"icon"}
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="text-muted-background rounded-full"
                  mode="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="rtl:rotate-180" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <span className="flex items-center text-muted-foreground text-sm gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>

          <Select indicatorPosition="right" defaultValue={String(pagination.pageSize)} onValueChange={(e) => setPagination((prev) => ({ ...prev, pageSize: Number(e) }))}>
            <SelectTrigger className="w-fit" size={"sm"}>
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((item) => (
                <SelectItem key={item} value={String(item)}>
                  Show {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
