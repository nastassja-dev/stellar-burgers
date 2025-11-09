import { FC, memo, useRef } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/store';
import { moveIngredient, removeIngredient } from '@slices';
import { useDrag, useDrop } from 'react-dnd';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement>(null);
    // DnD—drop зона
    const [{ isDragging }, drag] = useDrag({
      type: 'ingredient',
      item: { id: ingredient.id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });
    const [, drop] = useDrop({
      accept: 'constructor-ingredient',
      hover(item: { index: number }) {
        if (!ref.current || item.index === index) return;
        dispatch(moveIngredient({ fromIndex: item.index, toIndex: index }));
        item.index = index; // обновляем позицию в dnd
      }
    });

    drag(drop(ref)); // совмещаем drag & drop на одном ref

    // ручные обработчики
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient({ id: ingredient.id }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
