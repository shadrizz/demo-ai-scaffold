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
import { BugsWithRelationsList } from "@/repositories/bug-repository";

export function BugTable({ bugList }: { bugList: BugsWithRelationsList }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Sortable columnName="id">Id</Sortable></TableHead>
          <TableHead><Sortable columnName="title">Title</Sortable></TableHead>
          <TableHead><Sortable columnName="description">Description</Sortable></TableHead>
          <TableHead><Sortable columnName="priority">Priority</Sortable></TableHead>
          <TableHead><Sortable columnName="projectId">Project Id</Sortable></TableHead>
          <TableHead><Sortable columnName="assignedTo">Assigned To</Sortable></TableHead>
          <TableHead><Sortable columnName="statusId">Status Id</Sortable></TableHead>
          <TableHead><Sortable columnName="createdAt">Created At</Sortable></TableHead>
          <TableHead><Sortable columnName="updatedAt">Updated At</Sortable></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { bugList.map((bugObj) => (
          <TableRow key={ bugObj.id }>
            <TableCell>{ bugObj.id }</TableCell>
            <TableCell>{ bugObj.title }</TableCell>
            <TableCell>{ bugObj.description }</TableCell>
            <TableCell>{ bugObj.priority }</TableCell>
            <TableCell>{ bugObj.projectId }</TableCell>
            <TableCell>{ bugObj.assignedTo }</TableCell>
            <TableCell>{ bugObj.statusId }</TableCell>
            <TableCell>{ bugObj.createdAt?.toLocaleString() }</TableCell>
            <TableCell>{ bugObj.updatedAt?.toLocaleString() }</TableCell>
            <TableCell className="justify-end flex gap-2">
              <Link href={`/admin/bugs/${ bugObj.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/bugs/${ bugObj.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/bugs/${ bugObj.id }/delete`}>
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
