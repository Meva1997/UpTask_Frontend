import { useDroppable } from '@dnd-kit/core';

type DropTaskProps = {
  status: string;
}

export default function DropTask({status }: DropTaskProps) {

  const {isOver, setNodeRef} = useDroppable({
    id: status
  })
  const style = {
    opacity: isOver ? 0.5 : undefined,
  }
  return (
    <div className='tetx-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500'
      ref={setNodeRef}
      style={style}
    >
      Drop Task Here 
    </div>
  )
}
