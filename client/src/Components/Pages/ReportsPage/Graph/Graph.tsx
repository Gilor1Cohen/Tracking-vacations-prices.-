import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { GraphProps } from "../../../../Helpers/interfaces";
import "./Graph.css";

export function Graph({ data }: GraphProps): JSX.Element {
  return (
    <ResponsiveBar
      data={data.map((item) => ({
        vacation: item.vacation_destination,
        likes: item.likes_count,
      }))}
      keys={["likes"]}
      indexBy="vacation"
      margin={{ top: 20, right: 30, bottom: 100, left: 50 }}
      padding={0.125}
      layout="vertical"
      colors={["#007aff"]}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 12,
        tickRotation: 45,
        legend: "Likes",
        legendPosition: "middle",
        legendOffset: 90,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 15,
        tickRotation: 0,
        legend: "Destination",
        legendPosition: "middle",
        legendOffset: -40,
        tickValues: "auto",
      }}
      borderRadius={8}
      innerPadding={2}
    />
  );
}
