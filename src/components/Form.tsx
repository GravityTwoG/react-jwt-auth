import { cn } from '@/utils';
import { ComponentProps } from 'react';
import { Paper } from './Paper/Paper';

export type FormProps = ComponentProps<'form'>;

export const Form = (props: FormProps) => {
  return (
    <Paper className="mt-4 py-8 px-6 w-[480px] max-w-full">
      <form {...props} className={cn('flex flex-col gap-4', props.className)}>
        {props.children}
      </form>
    </Paper>
  );
};
