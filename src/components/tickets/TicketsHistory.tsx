import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchUserTickets } from '@/services/GameService';
import { DatePicker } from '@/components/ui/date-picker';
import { ticketStatus } from '@/configs/app';
import type { GameTicket } from '@/types/game';
import { getColumns } from './column';
import { TicketPreview } from './ticketPreview';
import { MobileDataCards, type CardField } from '@/components/ui/mobile-data-cards';
import { Badge } from '@/components/ui/base-badge';
import { formatCurrency, fullDateFormat } from '@/lib/utils';

// interface TicketHistoryProps {
//   tickets: GameTicket[];
//   isLoading: boolean;
//   pageSize: number
//   totalCount: number
//   totalPages: number
//   page: number
// }

interface PageProps {
  pageIndex: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
  ticketStatusId?: number;
}

const mobileFields: CardField<GameTicket>[] = [
  {
    label: 'Date',
    value: (t) => fullDateFormat(t.dateRegistered),
  },
  {
    label: 'Game',
    value: (t) => t.game.name,
  },
  {
    label: 'Amount',
    value: (t) => formatCurrency(t.amount),
    bold: true,
  },
  {
    label: 'Won',
    value: (t) => formatCurrency(t.wonAmount),
    bold: true,
  },
];

function getStatusBadge(status?: string) {
  switch (status) {
    case 'Won':
      return <Badge variant="success" appearance="outline" size="sm" shape="circle">Won</Badge>;
    case 'Lost':
      return <Badge variant="destructive" appearance="outline" size="sm" shape="circle">Lost</Badge>;
    case 'Undecided':
      return <Badge variant="warning" appearance="outline" size="sm" shape="circle">Undecided</Badge>;
    case 'Active':
      return <Badge variant="primary" appearance="outline" size="sm" shape="circle">Active</Badge>;
    case 'Inactive':
      return <Badge variant="secondary" appearance="outline" size="sm" shape="circle">Inactive</Badge>;
    default:
      return <Badge variant="secondary" appearance="outline" size="sm" shape="circle">{status || 'Pending'}</Badge>;
  }
}

export const TicketsHistory = () => {

  const [pagination, setPagination] = useState<PageProps>({
    pageIndex: 0,
    pageSize: 10,
    startDate: moment().subtract(7, 'days').toISOString(),
    endDate: moment().add(1, 'days').toISOString(),
    ticketStatusId: 0
  });

  const [selectedTicket, setSelectedTicket] = useState<GameTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tickets, isFetching } = useQuery({
    queryKey: ['tickets', pagination],
    queryFn: () => fetchUserTickets(pagination),
    placeholderData: keepPreviousData,
  })

  const defaultData = useMemo(() => [], [])

  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);

  const handleSelectedTicket = useCallback((ticket: GameTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  }, []);


  const columns = useMemo(
    () => getColumns(handleSelectedTicket),
    [handleSelectedTicket]
  );


  const [, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data: tickets?.data ?? defaultData,
    rowCount: tickets?.totalCount,
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
      recordCount={tickets?.totalCount || 0}
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
      loadingMessage="Loading Tickets..."
      emptyMessage="No Tickets Found."
    >
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-col md:flex-row border-b-0 gap-4 px-0 pb-4">
          {/* ticket status */}
          <Select
            value={String(pagination.ticketStatusId ?? 0)}
            onValueChange={(statusId) =>
              setPagination((prev) => ({ ...prev, ticketStatusId: Number(statusId) }))
            }
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {ticketStatus.map((status) => (
                <SelectItem value={String(status.id)} key={status.id}>{status.name}</SelectItem>
              ))}

            </SelectContent>
          </Select>
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
          <MobileDataCards<GameTicket>
            data={tickets?.data ?? []}
            fields={mobileFields}
            keyAccessor={(t) => t.id}
            isLoading={isFetching}
            emptyMessage="No Tickets Found."
            cardHeader={(t) => (
              <>
                <span className="font-semibold text-sm text-foreground">#{t.id}</span>
                {getStatusBadge(t.status?.name)}
              </>
            )}
            cardFooter={(t) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectedTicket(t)}
                className="w-full text-muted-foreground text-sm"
              >
                <Eye className="mr-1 h-4 w-4" />
                View Ticket
              </Button>
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
        <CardFooter className="p-0 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">

          <Pagination className="justify-start w-fit mx-0">
            <PaginationContent className='gap-2'>
              {/* Previous Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="text-muted-foreground"
                  shape="circle"
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
                    shape={"circle"}
                    variant={table.getState().pagination.pageIndex === pageIndex ? 'primary' : 'outline'}
                    className={`${table.getState().pagination.pageIndex === pageIndex
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
                  className="text-muted-background"
                  shape="circle"
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
        {selectedTicket && <TicketPreview open={isModalOpen} setOpen={setIsModalOpen} ticket={selectedTicket} />
        }
      </Card>
    </DataGrid>
  );
}
