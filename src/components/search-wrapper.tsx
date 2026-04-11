"use client";

import { Search } from "./search";

interface SearchWrapperProps {
  articles: {
    title: string;
    description: string;
    slug: string;
    contentType: string;
    category: string;
  }[];
}

export function SearchWrapper({ articles }: SearchWrapperProps) {
  return <Search articles={articles} />;
}
