import type { Nullable } from "~/types/primitives/objects";

export enum GraphType {
  GAUGE = 2,
  POLAR = 3,
  LEADER_BOARD = 5,
  HORIZONTAL_BAR = 4,
  VERTICAL_BAR = 7,
  VALUE = 8,
  INDIVIDUAL_CHOICE = 9,
}

export interface GaugeChartData {
  color: string;
  min: number;
  max: number;
  value: number;
  percent: boolean;
}
export interface BarChartData {
  categories: string[];
  series: {
    name: string;
    color: string;
    config: {
      min: number;
      max: number;
    };
    data: number[];
  }[];
}
export interface PolarChartData {
  percent: boolean;
  series: {
    name: string;
    color: string;
    config: {
      min: number;
      max: number;
    };
    data: number;
  }[];
}
export interface LeaderBoardChartData {
  series: {
    label: string;
    picture: string;
    highlighted: boolean;
    position: number;
    value: number;
  }[];
}
export interface IndividualChoiceChartData {
  series: {
    name: string;
    description: string;
    picture: Nullable<string>;
    checked: true;
  }[];
}
export interface ValueChartData {
  title: number;
  subtitle: string;
  percent: boolean;
}

export type ChartData = ValueChartData | GaugeChartData | BarChartData | PolarChartData | LeaderBoardChartData | IndividualChoiceChartData;
