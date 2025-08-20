import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { Size } from 'src/types';
import gridTileSvg from 'src/assets/grid-tile-bg.svg';
import gridTopTileSvg from 'src/assets/grid-tile-top-bg.svg';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { PROJECTED_TILE_SIZE, UNPROJECTED_TILE_SIZE } from 'src/config';
import { SizeUtils } from 'src/utils/SizeUtils';
import { useResizeObserver } from 'src/hooks/useResizeObserver';

export const Grid = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { size } = useResizeObserver(elementRef.current);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const scroll = useUiStateStore((state) => state.scroll);
  const zoom = useUiStateStore((state) => state.zoom);
  const projection = useUiStateStore((state) => state.projection);

  useEffect(() => {
    if (!elementRef.current) return;

    const baseTile =
      projection === 'TOP'
        ? { width: UNPROJECTED_TILE_SIZE, height: UNPROJECTED_TILE_SIZE }
        : PROJECTED_TILE_SIZE;
    const tileSize = SizeUtils.multiply(baseTile, zoom);
    const elSize = elementRef.current.getBoundingClientRect();
    const backgroundPosition: Size = {
      width: elSize.width / 2 + scroll.position.x + tileSize.width / 2,
      height:
        elSize.height / 2 + scroll.position.y +
        (projection === 'TOP' ? tileSize.height / 2 : 0)
    };

    gsap.to(elementRef.current, {
      duration: isFirstRender ? 0 : 0.25,
      backgroundSize:
        projection === 'TOP'
          ? `${tileSize.width}px ${tileSize.height}px`
          : `${tileSize.width}px ${tileSize.height * 2}px`,
      backgroundPosition: `${backgroundPosition.width}px ${backgroundPosition.height}px`
    });

    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [scroll, zoom, isFirstRender, size]);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <Box
        ref={elementRef}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `repeat url("${projection === 'TOP' ? gridTopTileSvg : gridTileSvg}")`
        }}
      />
    </Box>
  );
};
