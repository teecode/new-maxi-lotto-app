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
import { fetchGameResults } from '@/services/GameService';
import { useFetchDailyGames } from '@/hooks/useGames';
import { MobileDataCards, type CardField } from '@/components/ui/mobile-data-cards';
import type { GameResultType } from '@/types/game';
import Ball from '../ball';
import { Badge } from '../ui/base-badge';
import { fullDateFormat, getImageUrl } from '@/lib/utils';
import { Image } from "@unpic/react";


interface PageProps {
  pageIndex: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
  gameId?: number
}

const mobileFields: CardField<GameResultType>[] = [
  {
    label: 'Draw Date',
    value: (r) => fullDateFormat(r.endDateTime),
  },
  {
    label: 'Winning Numbers',
    value: (r) => (
      <div className="flex flex-wrap gap-1 mt-1">
        {[r.result.winningBall1, r.result.winningBall2, r.result.winningBall3, r.result.winningBall4, r.result.winningBall5].map((num) => (
          <Ball
            key={num}
            value={num}
            className="bg-gradient-to-b from-[#01B1A8] to-[#0185B6] rounded-full h-8 w-8 text-xs"
          />
        ))}
      </div>
    ),
  },
  {
    label: 'Machine Numbers',
    value: (r) => (
      <div className="flex flex-wrap gap-1 mt-1">
        {[r.result.machineBall1, r.result.machineBall2, r.result.machineBall3, r.result.machineBall4, r.result.machineBall5].map((num) => (
          <Ball
            key={num}
            value={num}
            isSelected
            className="rounded-full h-8 w-8 text-xs"
          />
        ))}
      </div>
    ),
  },
];


export const GameResultHistory = () => {

  const [pagination, setPagination] = useState<PageProps>({
    pageIndex: 0,
    pageSize: 10,
    startDate: '',
    endDate: '',
    gameId: 0
  });

  const { data: results, isFetching } = useQuery({
    queryKey: ['games_results', pagination],
    queryFn: () => fetchGameResults(pagination),
    placeholderData: keepPreviousData,
  })

  const { data: games } = useFetchDailyGames()

  const gameOptions = useMemo(() => games?.map((game) => ({ value: game.gameID, label: game.gameName })) || [], [games]);

  const defaultData = useMemo(() => [], [])

  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data: results?.data ?? defaultData,
    rowCount: results?.totalCount,
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
      recordCount={results?.totalCount || 0}
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
      loadingMessage="Loading Results..."
      emptyMessage="No Results Found."
    >
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-col md:flex-row border-b-0 gap-4 px-0 pb-4">
          <Select
            value={String(pagination.gameId ?? 0)}
            onValueChange={(gameId) =>
              setPagination((prev) => ({ ...prev, gameId: Number(gameId) }))
            }
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="Select Game" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="0">All Games</SelectItem>
              {gameOptions.map((game) => (
                <SelectItem key={game.value} value={String(game.value)}>
                  {game.label}
                </SelectItem>
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
          <MobileDataCards<GameResultType>
            data={results?.data ?? []}
            fields={mobileFields}
            keyAccessor={(r) => r.gameID}
            isLoading={isFetching}
            emptyMessage="No Results Found."
            cardHeader={(r) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Image src={getImageUrl(r.gameBackgroundImageUrl)} alt={r.gameName} width={24} height={24} />
                  <span className="font-semibold text-sm uppercase">{r.gameName}</span>
                </div>
                <Badge variant={r.isValidated ? "success" : "destructive"} appearance="outline" size="sm">
                  {r.isValidated ? "Validated" : "Not Validated"}
                </Badge>
              </div>
            )}
          />
        </div>

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
      </Card>
    </DataGrid>
  );
}
