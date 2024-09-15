/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as GroupsImport } from './routes/groups'
import { Route as IndexImport } from './routes/index'
import { Route as GroupsIndexImport } from './routes/groups.index'
import { Route as GroupsIdImport } from './routes/groups.$id'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const GroupsRoute = GroupsImport.update({
  path: '/groups',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const GroupsIndexRoute = GroupsIndexImport.update({
  path: '/',
  getParentRoute: () => GroupsRoute,
} as any)

const GroupsIdRoute = GroupsIdImport.update({
  path: '/$id',
  getParentRoute: () => GroupsRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/groups': {
      id: '/groups'
      path: '/groups'
      fullPath: '/groups'
      preLoaderRoute: typeof GroupsImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/groups/$id': {
      id: '/groups/$id'
      path: '/$id'
      fullPath: '/groups/$id'
      preLoaderRoute: typeof GroupsIdImport
      parentRoute: typeof GroupsImport
    }
    '/groups/': {
      id: '/groups/'
      path: '/'
      fullPath: '/groups/'
      preLoaderRoute: typeof GroupsIndexImport
      parentRoute: typeof GroupsImport
    }
  }
}

// Create and export the route tree

interface GroupsRouteChildren {
  GroupsIdRoute: typeof GroupsIdRoute
  GroupsIndexRoute: typeof GroupsIndexRoute
}

const GroupsRouteChildren: GroupsRouteChildren = {
  GroupsIdRoute: GroupsIdRoute,
  GroupsIndexRoute: GroupsIndexRoute,
}

const GroupsRouteWithChildren =
  GroupsRoute._addFileChildren(GroupsRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/groups': typeof GroupsRouteWithChildren
  '/login': typeof LoginRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/': typeof GroupsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups': typeof GroupsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/groups': typeof GroupsRouteWithChildren
  '/login': typeof LoginRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/': typeof GroupsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/groups' | '/login' | '/groups/$id' | '/groups/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/login' | '/groups/$id' | '/groups'
  id: '__root__' | '/' | '/groups' | '/login' | '/groups/$id' | '/groups/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  GroupsRoute: typeof GroupsRouteWithChildren
  LoginRoute: typeof LoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  GroupsRoute: GroupsRouteWithChildren,
  LoginRoute: LoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/groups",
        "/login"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/groups": {
      "filePath": "groups.tsx",
      "children": [
        "/groups/$id",
        "/groups/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/groups/$id": {
      "filePath": "groups.$id.tsx",
      "parent": "/groups"
    },
    "/groups/": {
      "filePath": "groups.index.tsx",
      "parent": "/groups"
    }
  }
}
ROUTE_MANIFEST_END */
