import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { statuses } from "@/schema/statuses";
import { StatusTable } from "@/components/admin/statuses/status-table";
import { getStatusesWithRelationsList } from "@/repositories/status-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search, sort, sortOrder } = parseSearchParams(searchParams);
  const count = await db.$count(statuses);
  const totalPages = Math.ceil(count / pageSize);
  const statusList = await getStatusesWithRelationsList({
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
          <SearchInput placeholder="Search Statuses" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/statuses/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <StatusTable statusList={ statusList } />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
