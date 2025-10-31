import { FC, useEffect } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeedThunk } from '@thunks';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useAppSelector((s) => s.orders.feed);
  // Тоталы из стора:
  const total = useAppSelector((s) => s.orders.total ?? 0);
  const totalToday = useAppSelector((s) => s.orders.totalToday ?? 0);
  const feed = { total, totalToday };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
