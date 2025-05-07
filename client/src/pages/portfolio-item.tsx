import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { PortfolioItem } from "@shared/schema";
import PortfolioItemComponent from "@/components/portfolio/portfolio-item";
import { getMetaDescription } from "@/lib/utils";

const PortfolioItemPage = () => {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data: portfolioItem, isLoading, error } = useQuery<PortfolioItem>({
    queryKey: [`/api/portfolio/${slug}`],
    onError: () => {
      // Redirect to 404 page if portfolio item not found
      setLocation("/not-found");
    }
  });

  if (isLoading) {
    return (
      <div className="container px-4 mx-auto py-20">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 max-w-lg mb-8 rounded"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 max-w-xl mb-12 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolioItem) {
    return null; // Handled by onError redirect
  }

  // Generate meta description from portfolio item description
  const metaDescription = getMetaDescription(portfolioItem.description);

  return (
    <>
      <Helmet>
        <title>{portfolioItem.title} | Portfolio | Samuel Marndi</title>
        <meta 
          name="description" 
          content={metaDescription}
        />
        <meta property="og:title" content={`${portfolioItem.title} | Portfolio | Samuel Marndi`} />
        <meta 
          property="og:description" 
          content={metaDescription}
        />
        <meta property="og:image" content={portfolioItem.imageUrl} />
      </Helmet>

      <div className="pt-16 pb-24">
        <PortfolioItemComponent item={portfolioItem} />
      </div>
    </>
  );
};

export default PortfolioItemPage;
