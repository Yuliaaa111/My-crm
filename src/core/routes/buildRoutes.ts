import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";

type RouteComponentsType = Record<string, ComponentType>;

type BuildRoutesParamsType = {
  pages: RouteComponentsType;
  layouts: RouteComponentsType;
  NotFound: ComponentType;
};

type RouteNodeType = {
  segment: string;
  Page?: ComponentType;
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
  const indexRoutes: RouteObject[] = node.Page
    ? [{ index: true, Component: node.Page }]
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
  pages,
  layouts,
  NotFound,
}: BuildRoutesParamsType): RouteObject[] => {
  const rootNode = createRouteNode(ROOT_SEGMENT);

  Object.entries(pages).forEach(([filePath, Page]) => {
    findOrCreateRouteNode(rootNode, getDirectorySegments(filePath)).Page = Page;
  });

  Object.entries(layouts).forEach(([filePath, Layout]) => {
    findOrCreateRouteNode(rootNode, getDirectorySegments(filePath)).Layout =
      Layout;
  });

  return [
    toRouteObject(rootNode, [{ path: NOT_FOUND_PATH, Component: NotFound }]),
  ];
};
