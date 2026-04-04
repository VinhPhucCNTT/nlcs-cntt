import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../api/courseApi";

export const useCourses = () =>
  useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
