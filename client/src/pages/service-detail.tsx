import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Service } from "@shared/schema";
import ServiceDetailComponent from "@/components/services/service-detail";
import { getMetaDescription } from "@/lib/utils";

const ServiceDetail = () => {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: [`/api/services/${slug}`],
    onError: () => {
      // Redirect to 404 page if service not found
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
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
              
              <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return null; // Handled by onError redirect
  }

  // Generate meta description from service description
  const metaDescription = getMetaDescription(service.fullDescription);

  return (
    <>
      <Helmet>
        <title>{service.title} | Samuel Marndi</title>
        <meta 
          name="description" 
          content={metaDescription}
        />
        <meta property="og:title" content={`${service.title} | Samuel Marndi`} />
        <meta 
          property="og:description" 
          content={metaDescription}
        />
        {service.imageUrl && (
          <meta property="og:image" content={service.imageUrl} />
        )}
      </Helmet>

      <div className="pt-16 pb-24">
        <ServiceDetailComponent service={service} />
      </div>
    </>
  );
};

export default ServiceDetail;
