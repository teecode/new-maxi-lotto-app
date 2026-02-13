import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, fullDateFormat } from "@/lib/utils";
import type { GameTicket } from "@/types/game";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/base-badge";
import { Button } from "@/components/ui/button.tsx";
import { Eye } from "lucide-react";

export const getColumns = (
  handleSelectedTicket: (ticket: GameTicket) => void
): ColumnDef<GameTicket>[] => [


    {
      accessorKey: 'ID',
      id: 'id',
      cell: ({ row }) => (
        <div>{row.original.id}</div>
      ),
      enableSorting: true,
      enableResizing: true,
      meta: {
        skeleton: <Skeleton className="w-28 h-7" />
      }
    },
    {
      accessorKey: 'Date',
      id: 'dateRegistered',
      header: ({ column }) => <DataGridColumnHeader title="Date" visibility={true} column={column} />,
      cell: ({ row }) => {
        return (
          <div>{fullDateFormat(row.original.dateRegistered)}</div>
        );
      },
      enableSorting: true,
      enableResizing: true,
      meta: {
        skeleton: <Skeleton className="w-28 h-7" />
      }
    },
    {
      accessorKey: 'Game',
      id: 'game',
      cell: ({ row }) => {
        return (
          <div>{row.original.game.name}</div>
        );
      },
      size: 100,
      enableSorting: true,
      enableHiding: false,
      enableResizing: true,
      meta: {
        skeleton: <Skeleton className="w-28 h-7" />
      }
    },
    {
      accessorKey: 'Amount',
      id: 'amount',
      header: ({ column }) => <DataGridColumnHeader title="Amount" visibility={true} column={column} />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5">
            {formatCurrency(row.original.amount)}
          </div>
        );
      },

      meta: {
        headerClassName: '',
        cellClassName: 'text-start',
        skeleton: <Skeleton className="w-28 h-7" />
      },
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorKey: 'Won Amount',
      id: 'wonAmount',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5">
            {formatCurrency(row.original.wonAmount)}
          </div>
        );
      },
      meta: {
        headerClassName: '',
        cellClassName: 'text-start',
        skeleton: <Skeleton className="w-28 h-7" />
      },
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
    },

    {
      accessorKey: 'status',
      id: 'status',
      header: ({ column }) => <DataGridColumnHeader title="Status" visibility={true} column={column} />,
      cell: ({ row }) => {
        const status = row.original.status?.name;

        switch (status) {
          case 'Won':
            return (
              <Badge variant="success" appearance="outline">
                Won
              </Badge>
            );
          case 'Lost':
            return (
              <Badge variant="destructive" appearance="outline">
                Lost
              </Badge>
            );
          case 'Undecided':
            return (
              <Badge variant="warning" appearance="outline">
                Undecided
              </Badge>
            );
          case 'Active':
            return (
              <Badge variant="primary" appearance="outline">
                Active
              </Badge>
            );
          case 'Inactive':
            return (
              <Badge variant="secondary" appearance="outline">
                Inactive
              </Badge>
            );
          default:
            return (
              <Badge variant="secondary" appearance="outline">
                {status || 'Pending'}
              </Badge>
            );
        }
      },
      size: 100,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: <Skeleton className="w-28 h-7" />
      }
    },

    {
      accessorKey: 'action',
      id: 'action',
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectedTicket(ticket)}
              className="text-muted-foreground text-sm"
            >
              <Eye className="mr-1 h-4 w-4" />
              view
            </Button>

            {/* <Button variant="outline" asChild size="sm">
              <Link
                to="/tickets/$ticketId"
                params={{ ticketId: String(ticket.id) }}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" /> View
              </Link>
            </Button> */}
          </div>
        );
      },
    }


  ];

