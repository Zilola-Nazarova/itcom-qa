import QuestionList from "./QuestionList";
import { Suspense } from "react";
import Loading from "../loading";
import FilterByStatus from '../components/FilterByStatus';
import FilterByTag from '../components/FilterByTag';
import Limit from '../components/Limit';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import SortByOrder from '../components/SortByOrder';
import SortDirection from '../components/SortDirection';
import { getQuestions } from "@/lib/api";

export default async function QuestionsPage(
  {
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
      order_by?: string;
      tags?: string[];
      status?: string;
      sort?: string;
      limit?: string;
    };
  }
) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const orderBy = params?.order_by || '';
  const tags = params?.tags || [];
  const status = params?.status || '';
  const sort = params?.sort || '';
  const limit = Number(params?.limit) || 25;
  
  const pages = await getQuestions(
    query,
    currentPage,
    orderBy,
    tags,
    status,
    sort,
    limit
  );

  const totalPages = pages?.totalPages;

  const questionList: React.JSX.Element = await QuestionList({
    query,
    currentPage,
    orderBy,
    tags,
    status,
    sort,
    limit,
  });

  return (
    <div>
      <nav>
        <h2>Questions</h2>
        <div>
          <Search />
          <FilterByTag />
          <FilterByStatus />
          <SortByOrder />
          <SortDirection />
          <Limit />
        </div>
        <p>
          <small>Currently open questions.</small>
        </p>
      </nav>
      <Pagination totalPages={totalPages} />
      <Suspense
        key={query + currentPage + orderBy + tags + status + sort + limit}
        fallback={<Loading />}
      >
        {questionList}
      </Suspense>
    </div>
  );
}
