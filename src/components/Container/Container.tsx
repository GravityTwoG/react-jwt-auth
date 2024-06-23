import clsx from 'clsx';

import classes from './container.module.css';

export type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Container = (props: ContainerProps) => {
  return (
    <div className={clsx(classes.container, props.className)}>
      {props.children}
    </div>
  );
};
