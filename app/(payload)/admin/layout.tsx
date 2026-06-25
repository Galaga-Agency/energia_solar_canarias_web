import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts"
import type { ServerFunctionClient } from "payload"
import config from "@payload-config"
import { importMap } from "./importMap"
import "@payloadcms/next/css"
import "@/styles/admin.css"
import React from "react"

type Args = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Args) {
  const serverFunction: ServerFunctionClient = async (args) => {
    "use server"
    return handleServerFunctions({ ...args, config, importMap })
  }

  return RootLayout({ config, children, importMap, serverFunction })
}
