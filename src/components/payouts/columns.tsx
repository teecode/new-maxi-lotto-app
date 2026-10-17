import { Button } from "@/components/ui/button";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { fullDateFormat } from "@/lib/game-time";
import type { CustomerPayout } from "@/types/transaction";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "../ui/base-badge";
import { Link } from "@tanstack/react-router";

export const columns: ColumnDef<CustomerPayout>[] = [

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
    accessorKey: 'Service',
    id: 'serviceName',
    cell: ({ row }) => {
      return (
        <div>{row.original.serviceName}</div>
      );
    },
    enableSorting: true,
    enableResizing: true,
    meta: {
      skeleton: <Skeleton className="w-28 h-7" />
    }
  },
  {
    accessorKey: 'Bank',
    id: 'bank',
    cell: ({ row }) => {
      return (
        <div>{row.original.bank}</div>
      );
    },
    enableSorting: true,
    enableResizing: true,
    meta: {
      skeleton: <Skeleton className="w-28 h-7" />
    }
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => <DataGridColumnHeader title="Status" visibility={true} column={column} />,
    cell: ({ row }) => {
      const status = row.original.isPaid
      if (status) {
        return (<Badge variant="success" appearance="outline">
          {"Paid"}
        </Badge>
        )
      }
      else {
        return (<Badge variant="warning" appearance="outline">
          {"Unpaid"}
        </Badge>
        )
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
  // action
  {
    accessorKey: 'action',
    id: 'action',
    cell: ({ row }) => {
      return (
        <div>
          <Button variant="outline" asChild size="sm" className="text-muted-foreground items-center text-sm">
            <Link to="/payouts/$payoutId" params={{payoutId: String(row.original.id)}} className="flex items-center gap-1">
              <Eye /> view
            </Link>
          </Button>
        </div>
      );
    },
    size: 100,
    enableSorting: true,
    enableHiding: true,
    enableResizing: true,
    meta: {
      skeleton: <Skeleton className="w-28 h-7" />
    }
  },


];

