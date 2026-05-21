type DecorItemProps = {
  type: string;
  label?: string;
};

const DecorItem = ({ type, label }: DecorItemProps) => {
  return (
    <div className="decor-wrapper">
      <div className={`decor-item ${type}`}>
        {type === "bear" && (
          <>
            <div className="ear-left"></div>
            <div className="ear-right"></div>

            <div className="eye-left"></div>
            <div className="eye-right"></div>

            <div className="nose"></div>
            <div className="tummy"></div>
          </>
        )}
      </div>

      {label && <span className="decor-label">{label}</span>}
    </div>
  );
};

export default DecorItem;