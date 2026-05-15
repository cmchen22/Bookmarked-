type DecorItemProps = {
  type: string;
  label?: string;
};

const DecorItem = ({ type, label }: DecorItemProps) => {
  return (
    <div className="decor-wrapper">
      <div className={`decor-item ${type}`}></div>
      {label && <span className="decor-label">{label}</span>}
    </div>
  );
};

export default DecorItem;