import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";

export type PageLoaderType = () => Promise<ComponentType>;

type BuildRoutesParamsType = {
  pageLoaders: Record<string, PageLoaderType>;
  layouts: Record<string, ComponentType>;
  NotFound: ComponentType;
  PageFallback: ComponentType;
};

type RouteNodeType = {
  segment: string;
  loadPage?: PageLoaderType;
  Layout?: ComponentType;
  children: Map<string, RouteNodeType>;
};

const ROOT_SEGMENT = "";
const NOT_FOUND_PATH = "*";
const GROUP_SEGMENT_PATTERN = /^\(.+\)$/;
const DYNAMIC_SEGMENT_PATTERN = /^\[(.+)\]$/;

export const toRoutePath = (segment: string): string | undefined => {
  if (segment === ROOT_SEGMENT || GROUP_SEGMENT_PATTERN.test(segment)) {
    return undefined;
  }

  const dynamicSegmentMatch = DYNAMIC_SEGMENT_PATTERN.exec(segment);

  return dynamicSegmentMatch ? `:${dynamicSegmentMatch[1]}` : segment;
};

// "./(protected)/customers/[customerId]/page.tsx"
//   -> ["(protected)", "customers", "[customerId]"]
export const getDirectorySegments = (filePath: string): string[] =>
  filePath.split("/").slice(1, -1);

const createRouteNode = (segment: string): RouteNodeType => ({
  segment,
  children: new Map(),
});

const findOrCreateRouteNode = (
  rootNode: RouteNodeType,
  segments: string[],
): RouteNodeType =>
  segments.reduce((parentNode, segment) => {
    const existingNode = parentNode.children.get(segment);

    if (existingNode) {
      return existingNode;
    }

    const createdNode = createRouteNode(segment);
    parentNode.children.set(segment, createdNode);

    return createdNode;
  }, rootNode);

const toRouteObject = (
  node: RouteNodeType,
  extraChildRoutes: RouteObject[] = [],
): RouteObject => {
  // Pages are loaded on demand, so each page becomes its own chunk;
  // layouts stay in the main bundle because every page needs them.
  const { loadPage } = node;
  const indexRoutes: RouteObject[] = loadPage
    ? [{ index: true, lazy: { Component: loadPage } }]
    : [];
  const childRoutes = [...node.children.values()].map((childNode) =>
    toRouteObject(childNode),
  );

  return {
    path: toRoutePath(node.segment),
    Component: node.Layout,
    children: [...indexRoutes, ...childRoutes, ...extraChildRoutes],
  };
};

export const buildRoutes = ({
  pageLoaders,
  layouts,
  NotFound,
  PageFallback,
}: BuildRoutesParamsType): RouteObject[] => {
  const rootNode = createRouteNode(ROOT_SEGMENT);

  Object.entries(pageLoaders).forEach(([filePath, loadPage]) => {
    findOrCreateRouteNode(rootNode, getDirectorySegments(filePath)).loadPage =
      loadPage;
  });

  Object.entries(layouts).forEach(([filePath, Layout]) => {
    findOrCreateRouteNode(rootNode, getDirectorySegments(filePath)).Layout =
      Layout;
  });

  return [
    {
      ...toRouteObject(rootNode, [
        { path: NOT_FOUND_PATH, Component: NotFound },
      ]),
      HydrateFallback: PageFallback,
    },
  ];
};
