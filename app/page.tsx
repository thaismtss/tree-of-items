"use client";
import {useMemo } from "react";
import data from "./../data.json";
import Tree from "./components/Tree";
import { convertToList } from "../utils";

export default function Home() {
  const parsedData = useMemo(() => convertToList(data), []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-0">
      <h1 className="text-4xl text-center font-bold relative top-4 bg-white px-4">
        Árvore de Itens
      </h1>
      <div className="flex justify-center mx-auto md:w-3/5 w-full py-10 border border-gray-400 rounded-lg">
        <div className="flex flex-col gap-2 w-screen mx-4">
          <Tree data={parsedData} showControl/>
        </div>
      </div>
    </div>
  );
}
