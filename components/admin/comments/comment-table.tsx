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
import { CommentsWithRelationsList } from "@/repositories/comment-repository";

export function CommentTable({ commentList }: { commentList: CommentsWithRelationsList }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Sortable columnName="id">Id</Sortable></TableHead>
          <TableHead><Sortable columnName="bugId">Bug Id</Sortable></TableHead>
          <TableHead><Sortable columnName="userId">User Id</Sortable></TableHead>
          <TableHead><Sortable columnName="comment">Comment</Sortable></TableHead>
          <TableHead><Sortable columnName="createdAt">Created At</Sortable></TableHead>
          <TableHead><Sortable columnName="updatedAt">Updated At</Sortable></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { commentList.map((commentObj) => (
          <TableRow key={ commentObj.id }>
            <TableCell>{ commentObj.id }</TableCell>
            <TableCell>{ commentObj.bugId }</TableCell>
            <TableCell>{ commentObj.userId }</TableCell>
            <TableCell>{ commentObj.comment }</TableCell>
            <TableCell>{ commentObj.createdAt?.toLocaleString() }</TableCell>
            <TableCell>{ commentObj.updatedAt?.toLocaleString() }</TableCell>
            <TableCell className="justify-end flex gap-2">
              <Link href={`/admin/comments/${ commentObj.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/comments/${ commentObj.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/comments/${ commentObj.id }/delete`}>
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
