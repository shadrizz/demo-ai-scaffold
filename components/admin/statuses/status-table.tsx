import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sortable } from "@/components/sortable";
import { StatusesWithRelationsList } from "@/repositories/status-repository";

export function StatusTable({ statusList }: { statusList: StatusesWithRelationsList }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Sortable columnName="id">Id</Sortable></TableHead>
          <TableHead><Sortable columnName="statusName">Status Name</Sortable></TableHead>
          <TableHead><Sortable columnName="createdAt">Created At</Sortable></TableHead>
          <TableHead><Sortable columnName="updatedAt">Updated At</Sortable></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { statusList.map((statusObj) => (
          <TableRow key={ statusObj.id }>
            <TableCell>{ statusObj.id }</TableCell>
            <TableCell>{ statusObj.statusName }</TableCell>
            <TableCell>{ statusObj.createdAt?.toLocaleString() }</TableCell>
            <TableCell>{ statusObj.updatedAt?.toLocaleString() }</TableCell>
            <TableCell className="justify-end flex gap-2">
              <Link href={`/admin/statuses/${ statusObj.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/statuses/${ statusObj.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/statuses/${ statusObj.id }/delete`}>
                <Button size="icon" variant="outline">
                  <TrashIcon />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
