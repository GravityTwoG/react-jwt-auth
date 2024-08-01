import { clsx } from 'clsx';
import { ComponentProps } from 'react';

export type H1Props = ComponentProps<'h1'>;

export const H1 = (props: H1Props) => {
  return (
    <h1
      {...props}
      className={clsx('text-5xl leading-snug font-bold', props.className)}
    />
  );
};
