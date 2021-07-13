import React from 'react';

export default ({ block, contentState }) => {
  const entityKey = block.getEntityAt(0);
  const { src } = entityKey ? contentState.getEntity(entityKey).getData() : {};
  return <img src={src} />;
};