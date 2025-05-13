import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";


const DashboardCards = () => {
  const dispatch = useDispatch();
  const cardClass =
  "no-underline bg-white text-black px-8 py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 h-32 flex flex-col justify-center";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 w-full max-w-3xl mx-auto">
      <Link to="/mypage" className={cardClass}>
        <h3 className="text-xl font-semibold">My Page</h3>
      </Link>

      <Link to="/" className={cardClass}>
        <h3 className="text-xl font-semibold mb-1">My Posts</h3>
        <p className="text-3xl font-bold">12</p>
      </Link>

      <Link 
        to="/board/code" 
        className={cardClass}
        onClick={() => dispatch(setCategory({category: 'code'}))}
      >
        <h3 className="text-xl font-semibold">Code Board</h3>
      </Link>

      <Link 
        to="/board/assemble" 
        className={cardClass}
        onClick={() => dispatch(setCategory({category: 'assemble'}))}
      >
        <h3 className="text-xl font-semibold">Assemble Board</h3>
      </Link>
    </div>
  );
};

export default DashboardCards;
