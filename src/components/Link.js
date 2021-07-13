import React from "react";
import styled from "styled-components";

export default ({ contentState, entityKey, clickLink, children }) => {
  const { value } = contentState.getEntity(entityKey).getData();
  return <Link href={value} onClick={clickLink}>{children}</Link>;
};

const Link = styled.a`
  font-weight: bold;
  color: blue;
`;
