import useSWRInfinite from 'swr/infinite';
import { getPublishedBlogs } from '@/service/blog';
import { GetPublishedBlogsResponse } from '@/types/blog';

const PAGE_SIZE = 2;

export function useBlogs(searchTerm = '') {
	const getKey = (
		pageIndex: number,
		previousData: GetPublishedBlogsResponse | undefined
	) => {
		// Don't fetch next page if previous page has no edges
		if (previousData && !previousData.edges.length) return null;
		// First page, don't need cursor
		if (pageIndex === 0) return { first: PAGE_SIZE, query: searchTerm };
		// Get cursor from previous page
		return {
			after: pageIndex > 0 ? previousData?.pageInfo.endCursor : undefined,
			first: PAGE_SIZE,
			query: searchTerm
		};
	};

	const { data, error, size, setSize, isValidating } = useSWRInfinite(
		getKey,
		(key) => getPublishedBlogs(key),
		{ revalidateFirstPage: false }
	);

	const blogs = data
		? data.flatMap((page) => page?.edges.map((edge) => edge.node))
		: [];
	const isLoading = !data && !error;
	const isError = !!error;
	const isReachingEnd =
		data && data.length > 0
			? (data[data.length - 1]?.edges.length ?? 0) < PAGE_SIZE
			: false;
	const isLoadingMore =
		isValidating && data && typeof data[size - 1] !== 'undefined';

	return {
		blogs,
		isLoading,
		isError,
		size,
		setSize,
		isReachingEnd,
		isLoadingMore
	};
}
