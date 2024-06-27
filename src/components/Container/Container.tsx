import clsx from 'clsx';

import classes from './container.module.css';

export type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Container = (props: ContainerProps) => {
  return (
    <div
      className={clsx(classes.Container, props.className)}
      style={props.style}
    >
      {props.children}
    </div>
  );
};
