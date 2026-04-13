type DecorItemProps = {
  type: string;
};

const DecorItem = ({ type }: DecorItemProps) => {
  return <div className={`decor-item ${type}`}></div>;
};

export default DecorItem;