import { useMemo } from 'react';
import { Coords, Size, ProjectionOrientationEnum } from 'src/types';
import {
  getBoundingBox,
  getIsoProjectionCss,
  getTilePosition
} from 'src/utils';
import { UNPROJECTED_TILE_SIZE } from 'src/config';
import { useUiStateStore } from 'src/stores/uiStateStore';

interface Props {
  from: Coords;
  to: Coords;
  originOverride?: Coords;
  orientation?: keyof typeof ProjectionOrientationEnum;
}

export const useIsoProjection = ({
  from,
  to,
  originOverride,
  orientation
}: Props): {
  css: React.CSSProperties;
  position: Coords;
  gridSize: Size;
  pxSize: Size;
} => {
  const projection = useUiStateStore((state) => state.projection);
  const gridSize = useMemo(() => {
    return {
      width: Math.abs(from.x - to.x) + 1,
      height: Math.abs(from.y - to.y) + 1
    };
  }, [from, to]);

  const origin = useMemo(() => {
    if (originOverride) return originOverride;

    const boundingBox = getBoundingBox([from, to]);

    return boundingBox[3];
  }, [from, to, originOverride]);

  const position = useMemo(() => {
    if (projection === 'TOP') {
      return {
        x: origin.x * UNPROJECTED_TILE_SIZE,
        y: origin.y * UNPROJECTED_TILE_SIZE
      };
    }

    const pos = getTilePosition({
      tile: origin,
      origin: orientation === 'Y' ? 'TOP' : 'LEFT'
    });

    return pos;
  }, [origin, orientation, projection]);

  const pxSize = useMemo(() => {
    return {
      width: gridSize.width * UNPROJECTED_TILE_SIZE,
      height: gridSize.height * UNPROJECTED_TILE_SIZE
    };
  }, [gridSize]);

  const css = useMemo<React.CSSProperties>(() => {
    const base = {
      position: 'absolute' as const,
      left: position.x,
      top: position.y,
      width: `${pxSize.width}px`,
      height: `${pxSize.height}px`
    };

    if (projection === 'TOP') {
      return base;
    }

    return {
      ...base,
      transform: getIsoProjectionCss(orientation),
      transformOrigin: 'top left'
    };
  }, [position, pxSize, orientation, projection]);

  return {
    css,
    position,
    gridSize,
    pxSize
  };
};
