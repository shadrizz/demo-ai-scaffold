import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { projects } from "@/schema/projects";
import { ProjectTable } from "@/components/admin/projects/project-table";
import { getProjectsWithRelationsList } from "@/repositories/project-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search, sort, sortOrder } = parseSearchParams(searchParams);
  const count = await db.$count(projects);
  const totalPages = Math.ceil(count / pageSize);
  const projectList = await getProjectsWithRelationsList({
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
          <SearchInput placeholder="Search Projects" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/projects/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <ProjectTable projectList={ projectList } />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
