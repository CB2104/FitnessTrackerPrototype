import { calculateBMI, getBMICategory, getBMIColor } from "../utils/bmi";

interface Props {
  weight: number;
  height: number;
}

const BMIIndicator = ({ weight, height }: Props) => {
  const bmi = calculateBMI(weight, height);
  const colorClass = getBMIColor(getBMICategory(bmi));

  return (
    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          BMI
        </span>
        <span className={`text-lg font-bold ${colorClass}`}>{bmi}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
        <div className="flex-1 bg-blue-400 opacity-30"></div>
        <div className="flex-1 bg-emerald-500 opacity-30"></div>
        <div className="flex-1 bg-orange-500 opacity-30"></div>
        <div className="flex-1 bg-red-500 opacity-30"></div>
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
      </div>
    </div>
  );
};

export default BMIIndicator;
