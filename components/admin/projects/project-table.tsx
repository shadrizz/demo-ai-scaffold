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
import { ProjectsWithRelationsList } from "@/repositories/project-repository";

export function ProjectTable({ projectList }: { projectList: ProjectsWithRelationsList }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Sortable columnName="id">Id</Sortable></TableHead>
          <TableHead><Sortable columnName="name">Name</Sortable></TableHead>
          <TableHead><Sortable columnName="description">Description</Sortable></TableHead>
          <TableHead><Sortable columnName="userId">User Id</Sortable></TableHead>
          <TableHead><Sortable columnName="createdAt">Created At</Sortable></TableHead>
          <TableHead><Sortable columnName="updatedAt">Updated At</Sortable></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { projectList.map((projectObj) => (
          <TableRow key={ projectObj.id }>
            <TableCell>{ projectObj.id }</TableCell>
            <TableCell>{ projectObj.name }</TableCell>
            <TableCell>{ projectObj.description }</TableCell>
            <TableCell>{ projectObj.userId }</TableCell>
            <TableCell>{ projectObj.createdAt?.toLocaleString() }</TableCell>
            <TableCell>{ projectObj.updatedAt?.toLocaleString() }</TableCell>
            <TableCell className="justify-end flex gap-2">
              <Link href={`/admin/projects/${ projectObj.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/projects/${ projectObj.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/projects/${ projectObj.id }/delete`}>
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
