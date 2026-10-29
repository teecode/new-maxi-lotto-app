import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { fullDateFormat } from "@/lib/game-time";
import type { Transaction } from "@/types/transaction";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/base-badge";

export const columns: ColumnDef<Transaction>[] = [

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
        <div>{fullDateFormat(row.original.date)}</div>
      );
    },
    enableSorting: true,
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
    accessorKey: 'Type',
    id: 'category',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5">
          {row.original.category}
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
    cell: () => {
      // const status = row.original.isPaid ? 'Active' : 'Inactive';
      return (<Badge variant="success" appearance="outline">
        {"Success"}
      </Badge>
      )
    },
    size: 100,
    enableSorting: true,
    enableHiding: true,
    enableResizing: true,
    meta: {
      skeleton: <Skeleton className="w-28 h-7" />
    }
  }
];

