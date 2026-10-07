import { css } from "@emotion/css";

import { Button } from "@/core/ui/Button/Button";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";
import { Loader } from "@/core/ui/Loader/Loader";
import { PageHeader } from "@/core/ui/PageHeader/PageHeader";
import { useDashboard } from "../../../viewModel/useDashboard";
import { BarChartCard } from "../../components/BarChartCard/BarChartCard";
import { RecentOrdersCard } from "../../components/RecentOrdersCard/RecentOrdersCard";
import { StatTile } from "../../components/StatTile/StatTile";

import { useStyles } from "./DashboardScreen.styles";

const CHART_HEIGHT = 260;

export const DashboardScreen = () => {
  const styles = useStyles();
  const {
    statTiles,
    ordersByMonth,
    ordersByStatus,
    revenueByCategory,
    recentOrders,
    isLoading,
    loadErrorMessage,
    reloadAll,
    formatCount,
    formatCurrency,
    openOrder,
    openOrdersList,
  } = useDashboard();

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (loadErrorMessage) {
      return (
        <EmptyState
          title="Не удалось загрузить сводку"
          description={loadErrorMessage}
          action={<Button onClick={reloadAll}>Повторить</Button>}
        />
      );
    }

    return (
      <div className={css(styles.sections)}>
        <div className={css(styles.tiles)}>
          {statTiles.map(({ key, ...tile }) => (
            <StatTile key={key} {...tile} />
          ))}
        </div>
        <div className={css(styles.charts)}>
          <div className={css(styles.wideChart)}>
            <BarChartCard
              title="Заказы по месяцам"
              subtitle="Количество оформленных заказов, включая отменённые"
              data={ordersByMonth}
              valueName="Заказов"
              orientation="columns"
              height={CHART_HEIGHT}
              formatValue={formatCount}
              emptyMessage="Заказов пока нет"
            />
          </div>
          <BarChartCard
            title="Заказы по статусам"
            subtitle="Сколько заказов сейчас на каждом шаге"
            data={ordersByStatus}
            valueName="Заказов"
            orientation="bars"
            height={CHART_HEIGHT}
            formatValue={formatCount}
            emptyMessage="Заказов пока нет"
          />
          <BarChartCard
            title="Выручка по категориям"
            subtitle="Сумма позиций в заказах, кроме отменённых"
            data={revenueByCategory}
            valueName="Выручка"
            orientation="bars"
            height={CHART_HEIGHT}
            formatValue={formatCurrency}
            emptyMessage="Выручки пока нет"
          />
        </div>
        <RecentOrdersCard
          orders={recentOrders}
          onOpenOrder={openOrder}
          onOpenAll={openOrdersList}
        />
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Сводка"
        description="Показатели по клиентам, товарам и заказам"
      />
      {renderContent()}
    </>
  );
};
