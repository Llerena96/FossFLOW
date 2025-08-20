import React, { useCallback } from 'react';
import { Map as TopViewIcon, ViewInAr as IsoViewIcon } from '@mui/icons-material';
import { UiElement } from 'src/components/UiElement/UiElement';
import { IconButton } from 'src/components/IconButton/IconButton';
import { useUiStateStore } from 'src/stores/uiStateStore';

export const ProjectionToggle = () => {
  const projection = useUiStateStore((state) => state.projection);
  const actions = useUiStateStore((state) => state.actions);

  const toggleProjection = useCallback(() => {
    actions.setProjection(projection === 'ISOMETRIC' ? 'TOP' : 'ISOMETRIC');
  }, [actions, projection]);

  const isIso = projection === 'ISOMETRIC';
  const icon = isIso ? <TopViewIcon /> : <IsoViewIcon />;
  const name = isIso ? 'Switch to top view' : 'Switch to isometric view';

  return (
    <UiElement>
      <IconButton Icon={icon} name={name} onClick={toggleProjection} />
    </UiElement>
  );
};

export default ProjectionToggle;
