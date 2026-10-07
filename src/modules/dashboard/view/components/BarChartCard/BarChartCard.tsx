import { css } from "@emotion/css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAppTheme } from "@/core/hooks/useAppTheme";
import type { ChartDatumType } from "../../../model/types";

import { useStyles } from "./BarChartCard.styles";

const BAR_RADIUS = 4;
const BAR_THICKNESS = 18;
const AXIS_FONT_SIZE = 12;
// Room to the right of the longest bar for its value label, e.g. «1 458 990 ₽».
const DIRECT_LABEL_SPACE = 80;

type BarChartCardProps = {
  title: string;
  subtitle: string;
  data: ChartDatumType[];
  valueName: string;
  orientation: "columns" | "bars";
  height: number;
  formatValue: (value: number) => string;
  emptyMessage: string;
};

export const BarChartCard = ({
  title,
  subtitle,
  data,
  valueName,
  orientation,
  height,
  formatValue,
  emptyMessage,
}: BarChartCardProps) => {
  const styles = useStyles();
  const theme = useAppTheme();
  const isHorizontal = orientation === "bars";
  const axisTick = {
    fill: theme.colors.textSecondary,
    fontSize: AXIS_FONT_SIZE,
  };

  const renderChart = () => (
    <BarChart
      data={data}
      layout={isHorizontal ? "vertical" : "horizontal"}
      responsive
      style={{ width: "100%", height }}
      margin={{
        top: 8,
        right: isHorizontal ? DIRECT_LABEL_SPACE : 8,
        bottom: 0,
        left: 0,
      }}
      barCategoryGap={2}
    >
      <CartesianGrid
        stroke={theme.colors.border}
        horizontal={!isHorizontal}
        vertical={isHorizontal}
      />
      {isHorizontal ? (
        <>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width="auto"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: theme.colors.border }}
          />
        </>
      ) : (
        <>
          <XAxis
            dataKey="label"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: theme.colors.border }}
          />
          <YAxis
            allowDecimals={false}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={32}
          />
        </>
      )}
      <Tooltip
        cursor={{ fill: theme.colors.surfaceHover }}
        separator=": "
        formatter={(value) => [
          typeof value === "number" ? formatValue(value) : String(value),
          valueName,
        ]}
        contentStyle={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: BAR_RADIUS * 2,
          color: theme.colors.textPrimary,
        }}
        labelStyle={{ color: theme.colors.textPrimary, fontWeight: 600 }}
        itemStyle={{ color: theme.colors.textSecondary }}
      />
      <Bar
        dataKey="value"
        name={valueName}
        fill={theme.colors.chartSeries}
        maxBarSize={isHorizontal ? BAR_THICKNESS : BAR_THICKNESS * 2}
        radius={
          isHorizontal
            ? [0, BAR_RADIUS, BAR_RADIUS, 0]
            : [BAR_RADIUS, BAR_RADIUS, 0, 0]
        }
        isAnimationActive={false}
      >
        {isHorizontal ? (
          <LabelList
            dataKey="valueLabel"
            position="right"
            fill={theme.colors.textPrimary}
            fontSize={AXIS_FONT_SIZE}
          />
        ) : null}
      </Bar>
    </BarChart>
  );

  return (
    <section className={css(styles.root)} aria-label={title}>
      <h2 className={css(styles.title)}>{title}</h2>
      <p className={css(styles.subtitle)}>{subtitle}</p>
      {data.length === 0 ? (
        <p className={css(styles.empty)}>{emptyMessage}</p>
      ) : (
        <>
          <div aria-hidden="true">{renderChart()}</div>
          <table className={css(styles.visuallyHidden)}>
            <caption>{title}</caption>
            <tbody>
              {data.map(({ key, label, valueLabel }) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>{valueLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};
