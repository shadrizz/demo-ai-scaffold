import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { comments } from "@/schema/comments";
import { CommentTable } from "@/components/admin/comments/comment-table";
import { getCommentsWithRelationsList } from "@/repositories/comment-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search, sort, sortOrder } = parseSearchParams(searchParams);
  const count = await db.$count(comments);
  const totalPages = Math.ceil(count / pageSize);
  const commentList = await getCommentsWithRelationsList({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
    sort: sort,
    sortOrder: sortOrder,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Comments" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/comments/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <CommentTable commentList={ commentList } />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
