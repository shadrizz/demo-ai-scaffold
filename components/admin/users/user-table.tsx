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
import { UsersWithRelationsList } from "@/repositories/user-repository";

export function UserTable({ userList }: { userList: UsersWithRelationsList }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Sortable columnName="id">Id</Sortable></TableHead>
          <TableHead><Sortable columnName="name">Name</Sortable></TableHead>
          <TableHead><Sortable columnName="email">Email</Sortable></TableHead>
          <TableHead><Sortable columnName="emailVerified">Email Verified</Sortable></TableHead>
          <TableHead><Sortable columnName="image">Image</Sortable></TableHead>
          <TableHead><Sortable columnName="role">Role</Sortable></TableHead>
          <TableHead><Sortable columnName="password">Password</Sortable></TableHead>
          <TableHead><Sortable columnName="createdAt">Created At</Sortable></TableHead>
          <TableHead><Sortable columnName="updatedAt">Updated At</Sortable></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { userList.map((userObj) => (
          <TableRow key={ userObj.id }>
            <TableCell>{ userObj.id }</TableCell>
            <TableCell>{ userObj.name }</TableCell>
            <TableCell>{ userObj.email }</TableCell>
            <TableCell>{ userObj.emailVerified?.toLocaleString() }</TableCell>
            <TableCell>{ userObj.image }</TableCell>
            <TableCell>{ userObj.role }</TableCell>
            <TableCell>{ userObj.password }</TableCell>
            <TableCell>{ userObj.createdAt?.toLocaleString() }</TableCell>
            <TableCell>{ userObj.updatedAt?.toLocaleString() }</TableCell>
            <TableCell className="justify-end flex gap-2">
              <Link href={`/admin/users/${ userObj.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/users/${ userObj.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/users/${ userObj.id }/delete`}>
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
