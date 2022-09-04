import React from 'react';

export const PageLayout = (props: { children?: React.ReactNode | undefined }): JSX.Element => (
  <div className="container my-5 mx-auto">{props.children}</div>
);
